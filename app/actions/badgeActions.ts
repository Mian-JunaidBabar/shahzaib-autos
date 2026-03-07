/**
 * Badge Server Actions
 *
 * RBAC-protected actions for badge management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/services/auth.service";
import * as BadgeService from "@/lib/services/badge.service";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

function getSafeBadgeError(error: unknown, fallback: string): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta?.target.map(String)
        : [];
      if (target.some((field) => field.includes("name"))) {
        return "A badge with this name already exists.";
      }
      return "A unique value already exists. Please use a different one.";
    }

    if (error.code === "P2025") {
      return "The badge record was not found.";
    }
  }

  return fallback;
}

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
      error: "Failed to fetch badges",
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
      error: "Failed to fetch active badges",
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
      error: getSafeBadgeError(error, "Failed to create badge"),
    };
  }
}

/**
 * Update badge
 */
export async function updateBadgeAction(
  id: string,
  input: Partial<{ name: string; color: string; isActive: boolean }>,
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
      error: getSafeBadgeError(error, "Failed to update badge"),
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
      error: getSafeBadgeError(error, "Failed to delete badge"),
    };
  }
}
