"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import type {
  SavedImageDTO,
  CreateProductImageInput,
  ActionResult,
} from "@/lib/types/dto";

/**
 * Save product image to database
 * Requires a valid productId since ProductImage must be associated with a Product
 */
export async function saveProductImage(
  input: CreateProductImageInput,
): Promise<ActionResult<SavedImageDTO>> {
  try {
    const image = await prisma.productImage.create({
      data: {
        productId: input.productId,
        secureUrl: input.secureUrl,
        publicId: input.publicId,
        isPrimary: input.isPrimary ?? false,
        sortOrder: input.sortOrder ?? 0,
      },
    });

    return {
      success: true,
      data: {
        id: image.id,
        productId: image.productId,
        secureUrl: image.secureUrl,
        publicId: image.publicId,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
        uploadedAt: image.uploadedAt.toISOString(),
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

export async function deleteProductImage(
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
      await prisma.productImage.delete({
        where: {
          id: imageId,
        },
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

export async function getProductImages(
  productId?: string,
): Promise<ActionResult<SavedImageDTO[]>> {
  try {
    const images = await prisma.productImage.findMany({
      where: productId ? { productId } : undefined,
      orderBy: [{ sortOrder: "asc" }, { uploadedAt: "desc" }],
    });

    return {
      success: true,
      data: images.map((image) => ({
        id: image.id,
        productId: image.productId,
        secureUrl: image.secureUrl,
        publicId: image.publicId,
        isPrimary: image.isPrimary,
        sortOrder: image.sortOrder,
        uploadedAt: image.uploadedAt.toISOString(),
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
 * Set an image as the primary image for a product
 * This will unset any existing primary image
 */
export async function setPrimaryImage(
  imageId: string,
  productId: string,
): Promise<ActionResult<void>> {
  try {
    // Unset all existing primary images for this product
    await prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set the new primary image
    await prisma.productImage.update({
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
 * Update the sort order of product images
 */
export async function updateImageOrder(
  imageOrders: { id: string; sortOrder: number }[],
): Promise<ActionResult<void>> {
  try {
    await prisma.$transaction(
      imageOrders.map(({ id, sortOrder }) =>
        prisma.productImage.update({
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
