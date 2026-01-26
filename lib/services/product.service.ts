import { Prisma } from "@prisma/client";
/**
 * Product Service
 *
 * Business logic for product management:
 * - CRUD operations with soft-delete
 * - Image management
 * - Inventory tracking
 */
import { prisma } from "@/lib/prisma";

// Types
export type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true; inventory: true; badge: true };
}>;

export type CreateProductInput = {
  name: string;
  slug?: string; // Optional - auto-generated from name if not provided
  description?: string | null;
  price: number; // In cents
  category?: string | null;
  badgeId?: string | null;
  isActive?: boolean;
  stock?: number; // Alias for initialStock
  initialStock?: number;
  lowStockThreshold?: number; // Alias for lowStockAt
  lowStockAt?: number;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  id?: string;
  isActive?: boolean;
};

export type ProductFilters = {
  search?: string;
  category?: string;
  isActive?: boolean;
  lowStock?: boolean;
};

export type PaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Get paginated list of products
 */
export async function getProducts(
  filters: ProductFilters = {},
  pagination: PaginationOptions = {}
) {
  const { search, category, isActive, lowStock } = filters;
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination;

  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  // Low stock filter - requires subquery
  if (lowStock) {
    where.inventory = {
      quantity: {
        lte: prisma.inventory.fields.lowStockAt,
      },
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        inventory: true,
        badge: true,
      },
      orderBy: { [sortBy]: sortOrder },
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
 * Get a single product by ID or slug
 */
export async function getProduct(
  idOrSlug: string
): Promise<ProductWithImages | null> {
  return prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      badge: true,
    },
  });
}

/**
 * Create a new product with inventory
 */
export async function createProduct(
  input: CreateProductInput
): Promise<ProductWithImages> {
  const {
    initialStock,
    stock,
    lowStockAt,
    lowStockThreshold,
    slug,
    ...productData
  } = input;

  // Use stock or initialStock (validation uses stock, service historically used initialStock)
  const quantity = stock ?? initialStock ?? 0;
  const lowStockLevel = lowStockThreshold ?? lowStockAt ?? 10;

  // Auto-generate slug from name if not provided
  const productSlug =
    slug ||
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return prisma.product.create({
    data: {
      ...productData,
      slug: productSlug,
      inventory: {
        create: {
          quantity,
          lowStockAt: lowStockLevel,
        },
      },
    },
    include: {
      images: true,
      inventory: true,
      badge: true,
    },
  });
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<ProductWithImages> {
  const {
    initialStock,
    stock,
    lowStockAt,
    lowStockThreshold,
    id: _inputId, // Exclude id from update data
    ...productData
  } = input;

  // Use stock or initialStock
  const quantity = stock ?? initialStock;
  const lowStockLevel = lowStockThreshold ?? lowStockAt;

  // Update product
  const product = await prisma.product.update({
    where: { id },
    data: productData,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      badge: true,
    },
  });

  // Update inventory if provided
  if (quantity !== undefined || lowStockLevel !== undefined) {
    await prisma.inventory.upsert({
      where: { productId: id },
      update: {
        ...(quantity !== undefined && { quantity }),
        ...(lowStockLevel !== undefined && { lowStockAt: lowStockLevel }),
      },
      create: {
        productId: id,
        quantity: quantity || 0,
        lowStockAt: lowStockLevel || 10,
      },
    });
  }

  return product;
}

/**
 * Soft delete a product (set isActive = false)
 */
export async function deactivateProduct(
  id: string
): Promise<ProductWithImages> {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
    include: {
      images: true,
      inventory: true,
      badge: true,
    },
  });
}

/**
 * Hard delete a product (use with caution)
 */
export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  const categories = await prisma.product.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  return categories
    .map((p) => p.category)
    .filter((c): c is string => c !== null);
}

/**
 * Get low stock products
 */
export async function getLowStockProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
      inventory: {
        quantity: {
          lte: prisma.inventory.fields.lowStockAt,
        },
      },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      inventory: true,
    },
    orderBy: {
      inventory: { quantity: "asc" },
    },
    take: 10,
  });
}

/**
 * Update product stock
 */
export async function updateStock(
  productId: string,
  quantity: number,
  operation: "set" | "increment" | "decrement" = "set"
): Promise<void> {
  if (operation === "set") {
    await prisma.inventory.upsert({
      where: { productId },
      update: { quantity },
      create: { productId, quantity },
    });
  } else if (operation === "increment") {
    await prisma.inventory.update({
      where: { productId },
      data: { quantity: { increment: quantity } },
    });
  } else if (operation === "decrement") {
    await prisma.inventory.update({
      where: { productId },
      data: { quantity: { decrement: quantity } },
    });
  }
}

/**
 * Generate unique slug from name
 */
export async function generateSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
