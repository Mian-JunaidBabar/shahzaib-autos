/**
 * Badge Service
 *
 * Manages badge CRUD operations and retrieval.
 */
import { prisma } from "@/lib/prisma";


export interface BadgeInput {
  name: string;
  color: string;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Create a new badge
 */
export async function createBadge(input: BadgeInput) {
  return prisma.badge.create({
    data: {
      name: input.name,
      color: input.color,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

/**
 * Get all badges
 */
export async function getBadges() {
  return prisma.badge.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

/**
 * Get active badges only
 */
export async function getActiveBadges() {
  return prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

/**
 * Get badge by ID
 */
export async function getBadge(id: string) {
  return prisma.badge.findUnique({
    where: { id },
  });
}

/**
 * Get badge by name
 */
export async function getBadgeByName(name: string) {
  return prisma.badge.findUnique({
    where: { name },
  });
}

/**
 * Update badge
 */
export async function updateBadge(id: string, input: Partial<BadgeInput>) {
  return prisma.badge.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.color && { color: input.color }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

/**
 * Delete badge
 */
export async function deleteBadge(id: string) {
  // First, remove badge from all products
  await prisma.product.updateMany({
    where: { badgeId: id },
    data: { badgeId: null },
  });

  // Then delete the badge
  return prisma.badge.delete({
    where: { id },
  });
}

/**
 * Get badge usage count
 */
export async function getBadgeUsageCount(id: string) {
  return prisma.product.count({
    where: { badgeId: id },
  });
}

/**
 * Get all badges with usage count
 */
export async function getBadgesWithUsage() {
  const badges = await prisma.badge.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const badgesWithUsage = [];
  for (const badge of badges) {
    const usageCount = await getBadgeUsageCount(badge.id);
    badgesWithUsage.push({
      ...badge,
      usageCount,
    });
  }

  return badgesWithUsage;
}
