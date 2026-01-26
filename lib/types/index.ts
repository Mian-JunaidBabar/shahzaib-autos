/**
 * Types Index
 *
 * Central export for all type definitions
 */

// Export all DTOs and interfaces
export * from "./dto";

// Export Cloudinary types (excluding ProductImage to avoid conflict with Prisma's ProductImage)
export type {
  CloudinaryUploadResponse,
  ImageState,
  ImageUploadProps,
  FileValidationConfig,
  UploadState,
  CloudinaryUploadOptions,
  SaveImageResponse,
  DeleteImageResponse,
  GetImagesResponse,
  CloudinaryTransformOptions,
  ImageDeletionOptions,
  ValidationResult,
  ImageMetadata,
  BulkUploadRequest,
  BulkUploadResponse,
} from "./cloudinary";

// Re-export ProductImage from cloudinary as CloudinaryProductImage to avoid conflict with Prisma ProductImage
export type { ProductImage as CloudinaryProductImage } from "./cloudinary";
