/**
 * Upload Service
 *
 * Cloudinary image upload handling:
 * - Secure upload with validation
 * - Product image management
 * - Bulk upload support
 */
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Constants
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Types
export type UploadResult = {
  id: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
};

export type UploadOptions = {
  folder?: string;
  productId?: string;
  isPrimary?: boolean;
};

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const { folder = "shahzaib-autos", productId, isPrimary = false } = options;

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto:best" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });

  // If product ID provided, link to product
  if (productId) {
    // If isPrimary, unset other primary images first
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Get current max sort order
    const maxSort = await prisma.productImage.aggregate({
      where: { productId },
      _max: { sortOrder: true },
    });

    await prisma.productImage.create({
      data: {
        productId,
        publicId: result.public_id,
        secureUrl: result.secure_url,
        isPrimary,
        sortOrder: (maxSort._max.sortOrder || 0) + 1,
      },
    });
  }

  return {
    id: result.public_id,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  options: UploadOptions = {},
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], {
      ...options,
      isPrimary: i === 0 && options.isPrimary,
    });
    results.push(result);
  }

  return results;
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);

  // Also delete from database if exists
  await prisma.productImage.deleteMany({
    where: { publicId },
  });
}

/**
 * Delete multiple images
 */
export async function deleteImages(publicIds: string[]): Promise<void> {
  await Promise.all(publicIds.map(deleteImage));
}

/**
 * Update image sort order
 */
export async function updateImageOrder(
  productId: string,
  imageIds: string[],
): Promise<void> {
  await prisma.$transaction(
    imageIds.map((id, index) =>
      prisma.productImage.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

/**
 * Set primary image
 */
export async function setPrimaryImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await prisma.$transaction([
    // Unset all primary
    prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    }),
    // Set new primary
    prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    }),
  ]);
}

/**
 * Get product images
 */
export async function getProductImages(productId: string) {
  return prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
}
