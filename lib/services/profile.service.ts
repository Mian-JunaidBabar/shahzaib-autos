import { getSupabaseUser, createSupabaseServerClient } from "@/lib/auth";
/**
 * Profile Service
 *
 * Manages admin profile data (non-auth).
 * Identity and authentication come from Supabase Auth.
 */
import { prisma } from "@/lib/prisma";

export interface AdminProfileData {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get admin profile by Supabase user ID
 * Combines Supabase Auth metadata with database profile
 */
export async function getAdminProfile(
  supabaseUserId: string,
): Promise<AdminProfileData | null> {
  try {
    // Get admin record
    const admin = await prisma.admin.findUnique({
      where: { supabaseUserId },
      include: { profile: true },
    });

    if (!admin) {
      return null;
    }

    // Get email from Supabase Auth
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Combine data (prioritize Supabase Auth metadata)
    return {
      id: admin.supabaseUserId,
      email: user.email || "",
      fullName: user.user_metadata?.name || admin.profile?.fullName || null,
      avatarUrl:
        user.user_metadata?.avatar_url || admin.profile?.avatarUrl || null,
      createdAt: admin.profile?.createdAt || admin.createdAt,
      updatedAt: admin.profile?.updatedAt || admin.createdAt,
    };
  } catch (error) {
    console.error("Error getting admin profile:", error);
    return null;
  }
}

/**
 * Get current admin's profile
 */
export async function getCurrentAdminProfile(): Promise<AdminProfileData | null> {
  const user = await getSupabaseUser();
  if (!user) {
    return null;
  }

  return getAdminProfile(user.id);
}

/**
 * Update admin profile
 * Only updates Supabase Auth user_metadata (no database storage)
 */
export async function updateAdminProfile(
  supabaseUserId: string,
  data: {
    fullName?: string;
    avatarUrl?: string;
  },
): Promise<AdminProfileData | null> {
  try {
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { supabaseUserId },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    // Update Supabase Auth user_metadata (single source of truth)
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        ...(data.fullName !== undefined && { name: data.fullName }),
        ...(data.avatarUrl !== undefined && { avatar_url: data.avatarUrl }),
      },
    });

    if (error) {
      throw error;
    }

    return getAdminProfile(supabaseUserId);
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
}

/**
 * Update password using Supabase Auth
 */
export async function updateAdminPassword(newPassword: string): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password");
  }
}

/**
 * Create admin profile (called after admin is created)
 */
export async function createAdminProfile(
  adminId: string,
  supabaseUserId: string,
  data?: {
    fullName?: string;
    avatarUrl?: string;
  },
): Promise<void> {
  await prisma.adminProfile.create({
    data: {
      id: supabaseUserId,
      adminId,
      fullName: data?.fullName || null,
      avatarUrl: data?.avatarUrl || null,
    },
  });
}
