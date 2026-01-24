"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  saveProductImage,
  deleteProductImage,
} from "@/app/actions/imageActions";

export interface UploadedImage {
  id: string;
  secureUrl: string;
  publicId: string;
  uploadedAt: string;
}

interface ImageUploadProps {
  onImagesUpload?: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

interface ImageState {
  url: string;
  publicId: string;
  id?: string;
  isLoading?: boolean;
}

export function ImageUpload({
  onImagesUpload,
  maxFiles = 5,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError("Only image files are allowed");
          return false;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("File size must be less than 5MB");
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Check max files limit
      if (images.length + validFiles.length > maxFiles) {
        setUploadError(`Maximum ${maxFiles} images allowed`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      const uploadedImages: ImageState[] = [];

      for (const file of validFiles) {
        try {
          // Create preview immediately
          const preview = URL.createObjectURL(file);
          const tempImage: ImageState = {
            url: preview,
            publicId: "",
            isLoading: true,
          };
          setImages((prev) => [...prev, tempImage]);

          // Upload to Cloudinary
          const uploadResponse = await uploadImageToCloudinary(file);

          // Save to database
          const savedImage = await saveProductImage(
            uploadResponse.secure_url,
            uploadResponse.public_id,
          );

          uploadedImages.push({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            id: savedImage.id,
          });

          // Update the image state with actual data
          setImages((prev) =>
            prev.map((img) =>
              img.url === preview
                ? {
                    url: uploadResponse.secure_url,
                    publicId: uploadResponse.public_id,
                    id: savedImage.id,
                    isLoading: false,
                  }
                : img,
            ),
          );
        } catch (error) {
          console.error("Upload error:", error);
          setUploadError(
            error instanceof Error ? error.message : "Upload failed",
          );
          // Remove failed image from state
          setImages((prev) => prev.slice(0, -1));
        }
      }

      setIsUploading(false);

      if (uploadedImages.length > 0) {
        setSuccessMessage(
          `Successfully uploaded ${uploadedImages.length} image(s)`,
        );
        setTimeout(() => setSuccessMessage(null), 3000);

        if (onImagesUpload) {
          onImagesUpload(
            uploadedImages.map((img) => ({
              id: img.id || "",
              secureUrl: img.url,
              publicId: img.publicId,
              uploadedAt: new Date().toISOString(),
            })),
          );
        }
      }
    },
    [images.length, maxFiles, onImagesUpload],
  );

  const handleRemoveImage = async (index: number) => {
    const image = images[index];

    try {
      // Delete from database
      if (image.id) {
        await deleteProductImage(image.id, image.publicId);
      }

      // Remove from UI
      setImages((prev) => prev.filter((_, i) => i !== index));
      setSuccessMessage("Image deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setUploadError("Failed to delete image");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-blue-400");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-blue-400");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-2", "ring-blue-400");
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors dark:border-gray-600 dark:bg-gray-900"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading || images.length >= maxFiles}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {isUploading
              ? "Uploading..."
              : "Drag and drop images here, or click to select"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {images.length}/{maxFiles} images uploaded • Max 5MB per image
          </p>
        </div>
      </div>

      {/* Messages */}
      {uploadError && (
        <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300">
            {uploadError}
          </span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            {successMessage}
          </span>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {/* Image */}
                <img
                  src={image.url}
                  alt={`Uploaded ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Loading Overlay */}
                {image.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}

                {/* Delete Button */}
                {!image.isLoading && (
                  <button
                    onClick={() => handleRemoveImage(index)}
                    disabled={isUploading}
                    className="absolute right-2 top-2 hidden rounded-full bg-red-500 p-1.5 text-white transition-all hover:bg-red-600 disabled:opacity-50 group-hover:block"
                    aria-label="Delete image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
