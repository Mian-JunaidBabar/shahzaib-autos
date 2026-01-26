/**
 * Badge Server Actions
 *
 * RBAC-protected actions for badge management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as BadgeService from "@/lib/services/badge.service";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all badges
 */
export async function getBadgesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof BadgeService.getBadges>>>
> {
  try {
    const badges = await BadgeService.getBadges();
    return { success: true, data: badges };
  } catch (error) {
    console.error("getBadgesAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch badges",
    };
  }
}

/**
 * Get active badges only
 */
export async function getActiveBadgesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof BadgeService.getActiveBadges>>>
> {
  try {
    const badges = await BadgeService.getActiveBadges();
    return { success: true, data: badges };
  } catch (error) {
    console.error("getActiveBadgesAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch active badges",
    };
  }
}

/**
 * Create badge
 */
export async function createBadgeAction(input: {
  name: string;
  color: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const badge = await BadgeService.createBadge({
      name: input.name,
      color: input.color,
    });

    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: badge.id } };
  } catch (error) {
    console.error("createBadgeAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create badge",
    };
  }
}

/**
 * Update badge
 */
export async function updateBadgeAction(
  id: string,
  input: Partial<{ name: string; color: string; isActive: boolean }>
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    await BadgeService.updateBadge(id, input);

    revalidatePath("/admin/dashboard");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateBadgeAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update badge",
    };
  }
}

/**
 * Delete badge
 */
export async function deleteBadgeAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await BadgeService.deleteBadge(id);

    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("deleteBadgeAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete badge",
    };
  }
}
