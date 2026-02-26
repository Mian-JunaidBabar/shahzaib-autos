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

/**
 * Add a new team member
 * Creates Supabase Auth user + Admin record + AdminProfile
 */
export async function addTeamMember(input: {
    email: string;
    fullName: string;
    role: string;
}): Promise<TeamMember> {
    // Create user in Supabase Auth (sends invite email)
    const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
            email: input.email,
            email_confirm: false, // Will send confirmation/invite email
            user_metadata: { full_name: input.fullName },
        });

    if (authError) {
        throw new Error(`Failed to create Supabase user: ${authError.message}`);
    }

    if (!authData.user) {
        throw new Error("No user returned from Supabase");
    }

    // Create Admin + AdminProfile records
    const admin = await prisma.admin.create({
        data: {
            supabaseUserId: authData.user.id,
            profile: {
                create: {
                    id: authData.user.id,
                    fullName: input.fullName,
                    role: input.role,
                    status: "active",
                } as any,
            },
        },
        include: { profile: true },
    });

    return {
        id: admin.id,
        supabaseUserId: admin.supabaseUserId,
        email: input.email,
        fullName: input.fullName,
        avatarUrl: null,
        phone: null,
        role: input.role,
        status: "active",
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
