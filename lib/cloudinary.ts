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
 * Extract Cloudinary public_id from a Cloudinary delivery URL.
 *
 * Supports versioned and unversioned URLs, and strips transformations.
 * Example:
 * https://.../upload/v123/shahzaib-autos/products/tire.jpg -> shahzaib-autos/products/tire
 */
const TRANSFORMATION_PREFIXES = [
  "a_",
  "ar_",
  "b_",
  "bo_",
  "c_",
  "co_",
  "dpr_",
  "e_",
  "f_",
  "fl_",
  "g_",
  "h_",
  "l_",
  "o_",
  "q_",
  "r_",
  "t_",
  "u_",
  "w_",
  "x_",
  "y_",
  "z_",
];

function isLikelyTransformationSegment(segment: string): boolean {
  if (!segment) return false;
  if (segment.includes(",")) return true;
  return TRANSFORMATION_PREFIXES.some((prefix) => segment.startsWith(prefix));
}

export function extractPublicId(urlOrPublicId: string): string | null {
  const value = (urlOrPublicId ?? "").trim();
  if (!value) return null;

  // If this doesn't look like a Cloudinary delivery URL, assume it's already a public_id.
  if (!value.includes("/upload/") && !/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname;
    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const afterUpload = pathname.slice(uploadIndex + "/upload/".length);
    const segments = afterUpload.split("/").filter(Boolean);

    // Drop transformation segments (if present)
    while (segments.length > 0 && isLikelyTransformationSegment(segments[0])) {
      segments.shift();
    }

    // Drop version segment (v1234)
    if (segments.length > 0 && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }

    if (segments.length === 0) return null;

    // Remove file extension from final segment
    const last = segments[segments.length - 1];
    segments[segments.length - 1] = last.replace(/\.[^/.]+$/, "");

    const publicId = segments.join("/");
    return publicId || null;
  } catch {
    // Fallback for non-URL inputs that still include /upload/
    const uploadIndex = value.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    const afterUpload = value.slice(uploadIndex + "/upload/".length);
    const withoutQuery = afterUpload.split("?")[0].split("#")[0];
    const segments = withoutQuery.split("/").filter(Boolean);

    while (segments.length > 0 && isLikelyTransformationSegment(segments[0])) {
      segments.shift();
    }
    if (segments.length > 0 && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }
    if (segments.length === 0) return null;

    const last = segments[segments.length - 1];
    segments[segments.length - 1] = last.replace(/\.[^/.]+$/, "");
    const publicId = segments.join("/");
    return publicId || null;
  }
}

/**
 * Backwards-compatible alias.
 */
export function extractPublicIdFromUrl(url: string): string | null {
  return extractPublicId(url);
}

async function destroyImage(publicId: string): Promise<string | undefined> {
  const result = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
  });

  return typeof result?.result === "string" ? result.result : undefined;
}

/**
 * Delete an image from Cloudinary by public_id.
 * Soft-fail: logs and never throws.
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return;
  try {
    const result = await destroyImage(publicId);

    // "not found" is acceptable: image may already be deleted
    if (result && result !== "ok" && result !== "not found") {
      console.error(`Cloudinary delete returned '${result}' for ${publicId}`);
    }
  } catch (error) {
    console.error(`Error deleting Cloudinary image ${publicId}:`, error);
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

    const result = await destroyImage(publicId);

    if (result === "ok" || result === "not found") {
      return { success: true };
    }

    // Soft-fail behavior: log and return failure, caller decides whether to block.
    console.error(`Cloudinary delete returned '${result}' for ${publicId}`);
    return { success: false, error: `Cloudinary delete failed: ${result}` };
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
  const unique = Array.from(
    new Set((publicIds ?? []).map((p) => p?.trim()).filter(Boolean)),
  );
  const results = await Promise.allSettled(
    unique.map(async (publicId) => {
      const result = await deleteImageFromCloudinary(publicId);
      return { publicId, result };
    }),
  );

  const errors: string[] = [];
  let deletedCount = 0;

  for (const item of results) {
    if (item.status === "rejected") {
      errors.push(`Unknown error: ${String(item.reason)}`);
      continue;
    }

    if (item.value.result.success) {
      deletedCount++;
    } else if (item.value.result.error) {
      errors.push(`${item.value.publicId}: ${item.value.result.error}`);
    }
  }

  return { success: errors.length === 0, deletedCount, errors };
}
