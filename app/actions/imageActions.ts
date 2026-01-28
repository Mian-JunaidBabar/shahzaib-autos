"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import type { ActionResult } from "@/lib/types/dto";

/**
 * Unified Image DTO for frontend consumption
 */
export interface ImageDTO {
  id: string;
  publicId: string;
  secureUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  productId?: string | null;
  serviceId?: string | null;
}

/**
 * Input for creating an image
 */
export interface CreateImageInput {
  publicId: string;
  secureUrl: string;
  isPrimary?: boolean;
  sortOrder?: number;
  productId?: string;
  serviceId?: string;
}

/**
 * Save image to database (unified for products and services)
 * Must specify either productId OR serviceId
 */
export async function saveImage(
  input: CreateImageInput,
): Promise<ActionResult<ImageDTO>> {
  try {
    if (!input.productId && !input.serviceId) {
      return {
        success: false,
        error: "Must specify either productId or serviceId",
      };
    }

    const image = await prisma.image.create({
      data: {
        publicId: input.publicId,
        secureUrl: input.secureUrl,
        isPrimary: input.isPrimary ?? false,
        sortOrder: input.sortOrder ?? 0,
        productId: input.productId ?? null,
        serviceId: input.serviceId ?? null,
      },
    });

    return {
      success: true,
      data: {
        id: image.id,
        publicId: image.publicId,
        secureUrl: image.secureUrl,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
        createdAt: image.createdAt.toISOString(),
        productId: image.productId,
        serviceId: image.serviceId,
      },
    };
  } catch (error) {
    console.error("Error saving image to database:", error);
    return {
      success: false,
      error: "Failed to save image metadata to database",
    };
  }
}

/**
 * Legacy alias for backward compatibility with product forms
 */
export async function saveProductImage(input: {
  productId: string;
  secureUrl: string;
  publicId: string;
  isPrimary?: boolean;
  sortOrder?: number;
}): Promise<ActionResult<ImageDTO>> {
  return saveImage({
    productId: input.productId,
    publicId: input.publicId,
    secureUrl: input.secureUrl,
    isPrimary: input.isPrimary,
    sortOrder: input.sortOrder,
  });
}

/**
 * Save service image
 */
export async function saveServiceImage(input: {
  serviceId: string;
  secureUrl: string;
  publicId: string;
  isPrimary?: boolean;
  sortOrder?: number;
}): Promise<ActionResult<ImageDTO>> {
  return saveImage({
    serviceId: input.serviceId,
    publicId: input.publicId,
    secureUrl: input.secureUrl,
    isPrimary: input.isPrimary,
    sortOrder: input.sortOrder,
  });
}

/**
 * Delete image from Cloudinary and database
 */
export async function deleteImage(
  imageId: string | null | undefined,
  publicId: string,
): Promise<ActionResult<void>> {
  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    // Delete from database when we have a persisted image
    if (imageId) {
      await prisma.image.delete({
        where: { id: imageId },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: "Failed to delete image",
    };
  }
}

/**
 * Legacy alias for backward compatibility
 */
export async function deleteProductImage(
  imageId: string | null | undefined,
  publicId: string,
): Promise<ActionResult<void>> {
  return deleteImage(imageId, publicId);
}

/**
 * Get images for a product
 */
export async function getProductImages(
  productId?: string,
): Promise<ActionResult<ImageDTO[]>> {
  try {
    const images = await prisma.image.findMany({
      where: productId ? { productId } : { productId: { not: null } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return {
      success: true,
      data: images.map((image) => ({
        id: image.id,
        publicId: image.publicId,
        secureUrl: image.secureUrl,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
        createdAt: image.createdAt.toISOString(),
        productId: image.productId,
        serviceId: image.serviceId,
      })),
    };
  } catch (error) {
    console.error("Error fetching product images:", error);
    return {
      success: false,
      error: "Failed to fetch product images",
    };
  }
}

/**
 * Get images for a service
 */
export async function getServiceImages(
  serviceId: string,
): Promise<ActionResult<ImageDTO[]>> {
  try {
    const images = await prisma.image.findMany({
      where: { serviceId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return {
      success: true,
      data: images.map((image) => ({
        id: image.id,
        publicId: image.publicId,
        secureUrl: image.secureUrl,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
        createdAt: image.createdAt.toISOString(),
        productId: image.productId,
        serviceId: image.serviceId,
      })),
    };
  } catch (error) {
    console.error("Error fetching service images:", error);
    return {
      success: false,
      error: "Failed to fetch service images",
    };
  }
}

/**
 * Set an image as the primary image for a product or service
 * This will unset any existing primary image for the same entity
 */
export async function setPrimaryImage(
  imageId: string,
  entityId: string,
  entityType: "product" | "service" = "product",
): Promise<ActionResult<void>> {
  try {
    const whereClause =
      entityType === "product"
        ? { productId: entityId, isPrimary: true }
        : { serviceId: entityId, isPrimary: true };

    // Unset all existing primary images for this entity
    await prisma.image.updateMany({
      where: whereClause,
      data: { isPrimary: false },
    });

    // Set the new primary image
    await prisma.image.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error setting primary image:", error);
    return {
      success: false,
      error: "Failed to set primary image",
    };
  }
}

/**
 * Update the sort order of images
 */
export async function updateImageOrder(
  imageOrders: { id: string; sortOrder: number }[],
): Promise<ActionResult<void>> {
  try {
    await prisma.$transaction(
      imageOrders.map(({ id, sortOrder }) =>
        prisma.image.update({
          where: { id },
          data: { sortOrder },
        }),
      ),
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating image order:", error);
    return {
      success: false,
      error: "Failed to update image order",
    };
  }
}
