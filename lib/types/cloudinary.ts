/**
 * Cloudinary Image Upload System - TypeScript Types
 *
 * All types used throughout the image upload system
 */

/**
 * Response from Cloudinary upload API
 */
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  [key: string]: any;
}

/**
 * Image record stored in database
 */
export interface ProductImage {
  id: string;
  secureUrl: string;
  publicId: string;
  uploadedAt: string;
}

/**
 * Image state during upload in component
 */
export interface ImageState {
  url: string;
  publicId: string;
  id?: string;
  isLoading?: boolean;
}

/**
 * Props for ImageUpload component
 */
export interface ImageUploadProps {
  /** Callback fired when images are successfully uploaded */
  onImagesUpload?: (images: ProductImage[]) => void;
  /** Maximum number of images allowed */
  maxFiles?: number;
}

/**
 * File validation configuration
 */
export interface FileValidationConfig {
  /** Maximum file size in bytes */
  maxSize: number;
  /** Allowed MIME types */
  allowedTypes: string[];
  /** Custom error messages */
  messages: {
    invalidType: string;
    fileTooLarge: string;
    tooManyFiles: string;
  };
}

/**
 * Upload state for tracking progress
 */
export interface UploadState {
  /** Whether currently uploading */
  isUploading: boolean;
  /** Error message if any */
  uploadError: string | null;
  /** Success message if any */
  successMessage: string | null;
  /** Currently uploaded images */
  images: ImageState[];
  /** Total files to upload */
  totalFiles?: number;
  /** Files uploaded so far */
  uploadedCount?: number;
}

/**
 * Cloudinary upload options
 */
export interface CloudinaryUploadOptions {
  /** Upload preset (unsigned) */
  uploadPreset: string;
  /** Cloud name */
  cloudName: string;
  /** Folder path in Cloudinary */
  folder?: string;
  /** Additional parameters */
  [key: string]: any;
}

/**
 * Server action response types
 */
export interface SaveImageResponse {
  success: boolean;
  image?: ProductImage;
  error?: string;
}

export interface DeleteImageResponse {
  success: boolean;
  error?: string;
}

export interface GetImagesResponse {
  success: boolean;
  images?: ProductImage[];
  error?: string;
}

/**
 * Cloudinary transformation options
 */
export interface CloudinaryTransformOptions {
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Quality (auto, numeric, etc) */
  quality?: string | number;
  /** Format (auto, webp, jpg, png, etc) */
  format?: string;
  /** Crop mode */
  crop?:
    | "fill"
    | "thumb"
    | "scale"
    | "fit"
    | "mfit"
    | "pad"
    | "lpad"
    | "mpad"
    | "crop";
  /** Gravity for crop */
  gravity?: string;
  /** Additional parameters */
  [key: string]: any;
}

/**
 * Image deletion options
 */
export interface ImageDeletionOptions {
  /** Public ID to delete */
  publicId: string;
  /** Invalidate CDN cache */
  invalidate?: boolean;
}

/**
 * File validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
}

/**
 * Image metadata for display
 */
export interface ImageMetadata {
  id: string;
  secureUrl: string;
  publicId: string;
  uploadedAt: Date;
  /** Optional: additional custom metadata */
  [key: string]: any;
}

/**
 * Bulk upload request
 */
export interface BulkUploadRequest {
  files: File[];
  folder?: string;
}

/**
 * Bulk upload response
 */
export interface BulkUploadResponse {
  successful: ProductImage[];
  failed: Array<{
    file: File;
    error: string;
  }>;
  total: number;
}
