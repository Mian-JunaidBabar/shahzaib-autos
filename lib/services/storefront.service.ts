import type { Product, Image, Inventory, Badge } from "@prisma/client";
import { Prisma } from "@prisma/client";
/**
 * Storefront Service
 *
 * Public-facing product queries for the store.
 * Optimized for customer experience with proper filtering and sorting.
 */
import { prisma } from "@/lib/prisma";

// Types
export type StorefrontProduct = Product & {
  images: Image[];
  inventory: Inventory | null;
  badge?: Badge | null;
};

export type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc";

export type StorefrontFilterOptions = {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  limit?: number;
  page?: number;
};

export type StorefrontResult = {
  products: StorefrontProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Get products for storefront with filtering and sorting
 */
export async function getStorefrontProducts(
  options: StorefrontFilterOptions = {},
): Promise<StorefrontResult> {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    limit = 12,
    page = 1,
  } = options;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    isArchived: false,
  };

  // Search query (name, description, category)
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
    ];
  }

  // Category filter
  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }

  // Price range filter (prices are in cents)
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          // Check salePrice if exists
          {
            salePrice: {
              not: null,
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          },
          // Check regular price if no salePrice
          {
            salePrice: null,
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          },
        ],
      },
    ];
  }

  // Build orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "name_asc":
      orderBy = { name: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        inventory: true,
        badge: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single product by slug for the storefront
 */
export async function getStorefrontProduct(
  slug: string,
): Promise<StorefrontProduct | null> {
  return prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      isArchived: false,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      badge: true,
    },
  });
}

/**
 * Get related products (same category, excluding current)
 */
export async function getRelatedProducts(
  productId: string,
  category: string | null,
  limit: number = 4,
): Promise<StorefrontProduct[]> {
  if (!category) return [];

  return prisma.product.findMany({
    where: {
      id: { not: productId },
      category: { equals: category, mode: "insensitive" },
      isActive: true,
      isArchived: false,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      badge: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get all unique categories from active products
 */
export async function getAllCategories(): Promise<string[]> {
  const results = await prisma.product.findMany({
    where: {
      isActive: true,
      isArchived: false,
      category: { not: null },
    },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return results.map((r) => r.category).filter((c): c is string => c !== null);
}

/**
 * Get price range for active products
 */
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const result = await prisma.product.aggregate({
    where: {
      isActive: true,
      isArchived: false,
    },
    _min: { price: true },
    _max: { price: true },
  });

  return {
    min: result._min.price ?? 0,
    max: result._max.price ?? 100000,
  };
}

/**
 * Get featured products (products with badges or on sale)
 */
export async function getFeaturedProducts(
  limit: number = 8,
): Promise<StorefrontProduct[]> {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isArchived: false,
      OR: [{ badgeId: { not: null } }, { salePrice: { not: null } }],
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      badge: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
