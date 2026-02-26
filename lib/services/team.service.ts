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
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// Admin Supabase client (uses SERVICE_ROLE_KEY for user management)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
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
        supabaseUsers?.users?.map((u: User) => [u.id, u] as [string, User]) || []
    );

    return admins.map((admin) => {
        const supaUser = userMap.get(admin.supabaseUserId);
        return {
            id: admin.id,
            supabaseUserId: admin.supabaseUserId,
            email: supaUser?.email || "unknown@email.com",
            fullName: admin.profile?.fullName || supaUser?.user_metadata?.full_name || null,
            avatarUrl: admin.profile?.avatarUrl || null,
            phone: (admin.profile as any)?.phone || null,
            role: (admin.profile as any)?.role || "Admin",
            status: (admin.profile as any)?.status || "active",
            createdAt: admin.createdAt,
            lastSignIn: supaUser?.last_sign_in_at || null,
        };
    });
}

import { sendEmail, sendEmailAsync } from "@/lib/services/mail.service";
import TeamInviteEmail from "@/emails/TeamInviteEmail";

/**
 * Invite a new team member
 * Sends a valid custom Resend invite email + creates Admin + AdminProfile 
 */
export async function inviteTeamMember(input: {
    email: string;
    fullName: string;
    role: string;
}): Promise<TeamMember> {
    // Generate auth link for the user
    const { data: linkData, error: linkError } =
        await supabaseAdmin.auth.admin.generateLink({
            type: "invite",
            email: input.email,
            options: {
                data: { full_name: input.fullName }, // sets user_metadata
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/update-password`
            },
        });

    if (linkError) {
        throw new Error(`Failed to generate Supabase invite link: ${linkError.message}`);
    }

    if (!linkData.user || !linkData.properties?.action_link) {
        throw new Error("No user or action link returned from Supabase link generator");
    }

    // Create Admin + AdminProfile records first
    const admin = await prisma.admin.create({
        data: {
            supabaseUserId: linkData.user.id,
            profile: {
                create: {
                    id: linkData.user.id,
                    fullName: input.fullName,
                    role: input.role || "Admin",
                    status: "invited",
                } as any,
            },
        },
        include: { profile: true },
    });

    // Send custom email using Resend and await it
    const emailResult = await sendEmail({
        to: input.email,
        subject: "Welcome to Shahzaib Autos Admin Panel",
        react: TeamInviteEmail({
            inviteLink: linkData.properties.action_link,
            adminName: "Shahzaib Autos Admin"
        }) as any,
    });

    if (!emailResult.success) {
        console.error("Failed to send invite email via Resend:", emailResult.error);
        // We log the error but still return the admin to not fail the overall request,
        // or we could throw an error here depending on requirements.
    }

    return {
        id: admin.id,
        supabaseUserId: admin.supabaseUserId,
        email: input.email,
        fullName: input.fullName,
        avatarUrl: null,
        phone: null,
        role: "Admin", // default fallback for UI render
        status: "invited",
        createdAt: admin.createdAt,
        lastSignIn: null,
    };
}

/**
 * Update a team member's profile
 */
export async function updateTeamMember(
    adminId: string,
    input: { role?: string; status?: string; fullName?: string; phone?: string }
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
 * Remove a team member (deletes Admin record, keeps Supabase user)
 */
export async function removeTeamMember(adminId: string): Promise<void> {
    await prisma.admin.delete({
        where: { id: adminId },
    });
}
