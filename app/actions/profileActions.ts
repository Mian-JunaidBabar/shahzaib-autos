/**
 * Profile Server Actions
 *
 * Admin profile management using Supabase Auth + database
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as ProfileService from "@/lib/services/profile.service";
import { createSupabaseServerClient } from "@/lib/auth";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get current admin profile
 */
export async function getCurrentProfileAction(): Promise<
  ActionResult<
    Awaited<ReturnType<typeof ProfileService.getCurrentAdminProfile>>
  >
> {
  try {
    await requireAdmin();

    const profile = await ProfileService.getCurrentAdminProfile();

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, data: profile };
  } catch (error) {
    console.error("getCurrentProfileAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
}

/**
 * Update admin profile (name)
 */
export async function updateProfileAction(input: {
  fullName: string;
}): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await requireAdmin();

    await ProfileService.updateAdminProfile(session.user.id, {
      fullName: input.fullName,
    });

    revalidatePath("/admin/dashboard");

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error("updateProfileAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

/**
 * Upload and update avatar
 */
export async function uploadAvatarAction(
  formData: FormData,
): Promise<ActionResult<{ avatarUrl: string }>> {
  try {
    const session = await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const file = formData.get("avatar") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "File must be JPEG, PNG, WebP, or AVIF" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("admin-profile")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return { success: false, error: "Failed to upload file" };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("admin-profile")
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Update profile with new avatar URL
    await ProfileService.updateAdminProfile(session.user.id, {
      avatarUrl,
    });

    revalidatePath("/admin/dashboard");

    return { success: true, data: { avatarUrl } };
  } catch (error) {
    console.error("uploadAvatarAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload avatar",
    };
  }
}

/**
 * Update password
 */
export async function updatePasswordAction(input: {
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (input.newPassword !== input.confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    if (input.newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    await ProfileService.updateAdminPassword(input.newPassword);

    return { success: true };
  } catch (error) {
    console.error("updatePasswordAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update password",
    };
  }
}
