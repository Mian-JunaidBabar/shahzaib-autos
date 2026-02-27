import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
/**
 * Team Service
 *
 * Business logic for team management:
 * - List admins with profiles and Supabase metadata
 * - Add team members via Supabase Admin API
 * - Update admin profiles (role, status)
 * - Remove admin access
 */
import { prisma } from "@/lib/prisma";

// Admin Supabase client (uses SERVICE_ROLE_KEY for user management)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export type TeamMember = {
  id: string; // Admin table id
  supabaseUserId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: Date;
  lastSignIn: string | null;
};

/**
 * Get all team members with their profiles and Supabase metadata
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  // Get all admins with profiles from DB
  const admins = await prisma.admin.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  // Get all users from Supabase to merge last sign-in data
  const { data: supabaseUsers } = await supabaseAdmin.auth.admin.listUsers();
  const userMap = new Map<string, User>(
    supabaseUsers?.users?.map((u: User) => [u.id, u] as [string, User]) || [],
  );

  return admins.map((admin) => {
    const supaUser = userMap.get(admin.supabaseUserId);
    return {
      id: admin.id,
      supabaseUserId: admin.supabaseUserId,
      email: supaUser?.email || "unknown@email.com",
      fullName:
        admin.profile?.fullName || supaUser?.user_metadata?.full_name || null,
      avatarUrl: admin.profile?.avatarUrl || null,
      phone: (admin.profile as any)?.phone || null,
      role: admin.profile?.role || "ADMIN",
      status: admin.profile?.status || "INVITED",
      createdAt: admin.createdAt,
      lastSignIn: supaUser?.last_sign_in_at || null,
    };
  });
}

import React from "react";
import { sendEmail } from "@/lib/services/mail.service";
import TeamInviteEmail from "@/emails/TeamInviteEmail";

/**
 * Invite a new team member
 * Uses generateLink to create invite, then sends custom email via Resend
 */
export async function inviteTeamMember(input: {
  email: string;
  fullName: string;
}): Promise<TeamMember> {
  // Step 1: Generate invite link using Supabase Admin API
  const { data: linkData, error: linkError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: input.email,
      options: {
        data: { full_name: input.fullName },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/update-password`,
      },
    });

  if (linkError) {
    throw new Error(
      `Failed to generate Supabase invite link: ${linkError.message}`,
    );
  }

  if (!linkData.user || !linkData.properties?.action_link) {
    throw new Error(
      "No user or action link returned from Supabase link generator",
    );
  }

  // Step 2: Create Admin + AdminProfile records in database
  // Note: role defaults to "ADMIN" and status defaults to "INVITED" in schema
  const admin = await prisma.admin.create({
    data: {
      supabaseUserId: linkData.user.id,
      profile: {
        create: {
          id: linkData.user.id,
          fullName: input.fullName,
          // role and status use schema defaults: "ADMIN" and "INVITED"
        },
      },
    },
    include: { profile: true },
  });

  // Step 3: Send invite email using Resend
  const emailResult = await sendEmail({
    to: input.email,
    subject: "You've been invited to Shahzaib Autos Admin",
    react: TeamInviteEmail({
      inviteLink: linkData.properties.action_link,
      adminName: input.fullName,
    }) as React.ReactElement,
  });

  if (!emailResult.success) {
    console.error("Failed to send invite email via Resend:", emailResult.error);
  }

  return {
    id: admin.id,
    supabaseUserId: admin.supabaseUserId,
    email: input.email,
    fullName: input.fullName,
    avatarUrl: null,
    phone: null,
    role: "ADMIN",
    status: "INVITED",
    createdAt: admin.createdAt,
    lastSignIn: null,
  };
}

/**
 * Update a team member's profile
 */
export async function updateTeamMember(
  adminId: string,
  input: { role?: string; status?: string; fullName?: string; phone?: string },
): Promise<void> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    include: { profile: true },
  });

  if (!admin) throw new Error("Admin not found");

  const updateData: Record<string, string> = {};
  if (input.role !== undefined) updateData.role = input.role;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.fullName !== undefined) updateData.fullName = input.fullName;
  if (input.phone !== undefined) updateData.phone = input.phone;

  if (admin.profile) {
    await prisma.adminProfile.update({
      where: { adminId },
      data: updateData as any,
    });
  } else {
    // Create profile if it doesn't exist
    await prisma.adminProfile.create({
      data: {
        id: admin.supabaseUserId,
        adminId,
        ...updateData,
      } as any,
    });
  }
}

/**
 * Remove a team member (deletes from both Supabase Auth and Prisma)
 */
export async function removeTeamMember(adminId: string): Promise<void> {
  // Get the admin to find their Supabase user ID
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  // Delete from Supabase Auth first
  const { error: supabaseError } = await supabaseAdmin.auth.admin.deleteUser(
    admin.supabaseUserId,
  );

  if (supabaseError) {
    console.error(
      "Failed to delete user from Supabase:",
      supabaseError.message,
    );
    // Continue to delete from Prisma anyway
  }

  // Delete from Prisma (cascades to AdminProfile)
  await prisma.admin.delete({
    where: { id: adminId },
  });
}

/**
 * Confirm an admin's status to ACTIVE (called after password is set)
 */
export async function confirmAdminActive(
  supabaseUserId: string,
): Promise<void> {
  // Find the admin by Supabase user ID
  const admin = await prisma.admin.findUnique({
    where: { supabaseUserId },
    include: { profile: true },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  // Update status to ACTIVE
  await prisma.adminProfile.update({
    where: { id: supabaseUserId },
    data: { status: "ACTIVE" },
  });
}
