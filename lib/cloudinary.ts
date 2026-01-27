import "server-only";

import { v2 as cloudinary } from "cloudinary";

// Backend Cloudinary configuration (server-only)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/**
 * Extract public_id from a Cloudinary URL
 * URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Handle URLs with version: .../upload/v1234567890/folder/image.jpg
    // Handle URLs without version: .../upload/folder/image.jpg
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let path = url.substring(uploadIndex + 8); // Skip "/upload/"

    // Remove version prefix if present (v followed by digits)
    if (path.startsWith("v") && /^v\d+\//.test(path)) {
      path = path.replace(/^v\d+\//, "");
    }

    // Remove file extension
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path || null;
  } catch {
    return null;
  }
}

/**
 * Delete an image from Cloudinary by public_id
 * Returns true if successful, false otherwise
 */
export async function deleteImageFromCloudinary(
  publicId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!publicId) {
      return { success: false, error: "No public_id provided" };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result === "ok" || result.result === "not found") {
      // "not found" is acceptable - image may have been already deleted
      return { success: true };
    }

    return {
      success: false,
      error: `Cloudinary delete failed: ${result.result}`,
    };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete multiple images from Cloudinary
 * Returns count of successfully deleted images
 */
export async function deleteImagesFromCloudinary(
  publicIds: string[],
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
  const errors: string[] = [];
  let deletedCount = 0;

  for (const publicId of publicIds) {
    const result = await deleteImageFromCloudinary(publicId);
    if (result.success) {
      deletedCount++;
    } else if (result.error) {
      errors.push(`${publicId}: ${result.error}`);
    }
  }

  return {
    success: errors.length === 0,
    deletedCount,
    errors,
  };
}
