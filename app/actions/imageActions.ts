"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export interface SavedImage {
  id: string;
  secureUrl: string;
  publicId: string;
  uploadedAt: string;
}

export async function saveProductImage(
  secureUrl: string,
  publicId: string,
): Promise<SavedImage> {
  try {
    const image = await prisma.productImage.create({
      data: {
        secureUrl,
        publicId,
      },
    });

    return {
      id: image.id,
      secureUrl: image.secureUrl,
      publicId: image.publicId,
      uploadedAt: image.uploadedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error saving image to database:", error);
    throw new Error("Failed to save image metadata to database");
  }
}

export async function deleteProductImage(
  imageId: string,
  publicId: string,
): Promise<void> {
  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    // Delete from database
    await prisma.productImage.delete({
      where: {
        id: imageId,
      },
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export async function getProductImages(): Promise<SavedImage[]> {
  try {
    const images = await prisma.productImage.findMany({
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return images.map((image) => ({
      id: image.id,
      secureUrl: image.secureUrl,
      publicId: image.publicId,
      uploadedAt: image.uploadedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw new Error("Failed to fetch product images");
  }
}
