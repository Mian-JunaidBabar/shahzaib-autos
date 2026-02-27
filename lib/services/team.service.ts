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

export type InviteResult = {
  member: TeamMember;
  credentials: {
    fullName: string;
    email: string;
    password: string;
  };
};

/**
 * Generate a secure temporary password
 */
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const specialChars = "!@#$%&*";
  let password = "";

  // 10 alphanumeric characters
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Add 2 special characters
  for (let i = 0; i < 2; i++) {
    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length),
    );
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

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

/**
 * Invite a new team member
 * Creates user with auto-verified email and temp password
 * Admin copies credentials and shares privately (no email service needed)
 */
export async function inviteTeamMember(input: {
  email: string;
  fullName: string;
  password?: string; // Optional - will generate if not provided
}): Promise<InviteResult> {
  // Step 1: Check if admin record already exists for this email
  const existingAdmins = await prisma.admin.findMany({
    include: { profile: true },
  });
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const users = existingUsers?.users || [];
  const existingUser = users.find(
    (u: User) => u.email?.toLowerCase() === input.email.toLowerCase(),
  );

  if (existingUser) {
    // Check if they already have an admin record
    const existingAdmin = existingAdmins.find(
      (a) => a.supabaseUserId === existingUser.id,
    );
    if (existingAdmin) {
      throw new Error("This email is already registered as a team member");
    }

    // User exists in Supabase but no admin record - clean up orphan
    console.log("Cleaning up orphan Supabase user:", existingUser.id);
    await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
  }

  // Step 2: Use provided password or generate one
  const tempPassword = input.password || generateTempPassword();

  // Step 3: Create user in Supabase with password (auto-verified)
  const { data: userData, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: tempPassword,
      email_confirm: true, // Auto-verified - no email confirmation needed
      user_metadata: { full_name: input.fullName },
    });

  if (createError) {
    throw new Error(
      `Failed to create user in Supabase: ${createError.message}`,
    );
  }

  if (!userData.user) {
    throw new Error("No user returned from Supabase createUser");
  }

  // Step 3: Create Admin + AdminProfile with stored temp password
  let admin;
  try {
    admin = await prisma.admin.create({
      data: {
        supabaseUserId: userData.user.id,
        profile: {
          create: {
            id: userData.user.id,
            fullName: input.fullName,
            tempPassword: tempPassword, // Store for admin to retrieve later
            // role and status use schema defaults: "ADMIN" and "INVITED"
          },
        },
      },
      include: { profile: true },
    });
  } catch (prismaError) {
    // Rollback: delete the Supabase user if Prisma fails
    console.error(
      "Prisma create failed, rolling back Supabase user:",
      prismaError,
    );
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    throw new Error(
      `Failed to create admin record: ${prismaError instanceof Error ? prismaError.message : "Unknown error"}`,
    );
  }

  const member: TeamMember = {
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

  return {
    member,
    credentials: {
      fullName: input.fullName,
      email: input.email,
      password: tempPassword,
    },
  };
}

/**
 * Get stored credentials for a pending team member
 * Only works for INVITED members (credentials cleared after first login)
 */
export async function getCredentials(
  adminId: string,
): Promise<{ fullName: string; email: string; password: string } | null> {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    include: { profile: true },
  });

  if (!admin) throw new Error("Admin not found");

  // Only return credentials for INVITED members
  if (admin.profile?.status !== "INVITED") {
    return null;
  }

  if (!admin.profile?.tempPassword) {
    return null;
  }

  // Get email from Supabase
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
    admin.supabaseUserId,
  );

  if (!userData.user?.email) {
    return null;
  }

  return {
    fullName: admin.profile.fullName || "Team Member",
    email: userData.user.email,
    password: admin.profile.tempPassword,
  };
}

/**
 * Update a team member's profile
 * Clears temp password when status changes to ACTIVE
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

  const updateData: Record<string, string | null> = {};
  if (input.role !== undefined) updateData.role = input.role;
  if (input.status !== undefined) {
    updateData.status = input.status;
    // Clear temp password when member becomes ACTIVE
    if (input.status === "ACTIVE") {
      updateData.tempPassword = null;
    }
  }
  if (input.fullName !== undefined) updateData.fullName = input.fullName;
  if (input.phone !== undefined) updateData.phone = input.phone;

  if (admin.profile) {
    await prisma.adminProfile.update({
      where: { adminId },
      data: updateData,
    });
  } else {
    // Create profile if it doesn't exist
    await prisma.adminProfile.create({
      data: {
        id: admin.supabaseUserId,
        adminId,
        ...updateData,
      },
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
