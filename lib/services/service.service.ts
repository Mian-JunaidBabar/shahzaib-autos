import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";
/**
 * Service Service
 *
 * Business logic for service management:
 * - CRUD operations for offered services
 * - Image management with Cloudinary cleanup
 * - Public/Active service queries
 */
import { prisma } from "@/lib/prisma";

// Types
export type ServiceWithDetails = Prisma.ServiceGetPayload<{}>;

export type CreateServiceInput = {
  title: string;
  slug?: string;
  description?: string | null;
  price: number;
  duration: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isActive?: boolean;
};

export type UpdateServiceInput = Partial<CreateServiceInput> & {
  id?: string;
};

export type ServiceFilters = {
  search?: string;
  isActive?: boolean;
};

export type ServicePaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Generate a unique slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Get paginated list of services
 */
export async function getServices(
  filters: ServiceFilters = {},
  pagination: ServicePaginationOptions = {},
) {
  const { search, isActive } = filters;
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination;

  const where: Prisma.ServiceWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  // Build orderBy clause
  const orderBy: Prisma.ServiceOrderByWithRelationInput = {};
  const validSortFields = ["title", "price", "duration", "createdAt"];
  const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  orderBy[sortField as keyof Prisma.ServiceOrderByWithRelationInput] =
    sortOrder;

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.service.count({ where }),
  ]);

  return {
    services,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

/**
 * Get all active services (for public display)
 */
export async function getActiveServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return services;
}

/**
 * Get single service by ID
 */
export async function getService(id: string) {
  return prisma.service.findUnique({
    where: { id },
  });
}

/**
 * Get single service by slug
 */
export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
  });
}

/**
 * Create a new service
 */
export async function createService(input: CreateServiceInput) {
  const slug = input.slug || generateSlug(input.title);

  // Check for duplicate slug
  const existing = await prisma.service.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error(`A service with slug "${slug}" already exists`);
  }

  return prisma.service.create({
    data: {
      title: input.title,
      slug,
      description: input.description,
      price: input.price,
      duration: input.duration,
      imageUrl: input.imageUrl,
      imagePublicId: input.imagePublicId,
      isActive: input.isActive ?? true,
    },
  });
}

/**
 * Update an existing service
 */
export async function updateService(id: string, input: UpdateServiceInput) {
  const existing = await prisma.service.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Service not found");
  }

  // Check for duplicate slug if slug is being updated
  if (input.slug && input.slug !== existing.slug) {
    const slugExists = await prisma.service.findFirst({
      where: {
        slug: input.slug,
        NOT: { id },
      },
    });

    if (slugExists) {
      throw new Error(`A service with slug "${input.slug}" already exists`);
    }
  }

  // If image is being changed, delete the old one from Cloudinary
  if (
    input.imagePublicId !== undefined &&
    existing.imagePublicId &&
    input.imagePublicId !== existing.imagePublicId
  ) {
    await deleteImageFromCloudinary(existing.imagePublicId);
  }

  return prisma.service.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.duration !== undefined && { duration: input.duration }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.imagePublicId !== undefined && {
        imagePublicId: input.imagePublicId,
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
  });
}

/**
 * Delete a service
 * IMPORTANT: Deletes image from Cloudinary before removing DB record
 */
export async function deleteService(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    return { success: false, error: "Service not found" };
  }

  // Delete image from Cloudinary first
  if (service.imagePublicId) {
    const cloudinaryResult = await deleteImageFromCloudinary(
      service.imagePublicId,
    );
    if (!cloudinaryResult.success) {
      console.warn(
        `Failed to delete Cloudinary image for service ${id}:`,
        cloudinaryResult.error,
      );
      // Continue with deletion even if Cloudinary fails (image might already be deleted)
    }
  }

  // Delete from database
  await prisma.service.delete({
    where: { id },
  });

  return { success: true };
}

/**
 * Toggle service active status
 */
export async function toggleServiceActive(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return prisma.service.update({
    where: { id },
    data: { isActive: !service.isActive },
  });
}

/**
 * Get service statistics
 */
export async function getServiceStats() {
  const [total, active, inactive] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: false } }),
  ]);

  return { total, active, inactive };
}
