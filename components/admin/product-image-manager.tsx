"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  GripVertical,
} from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProductImage {
  id: string;
  secureUrl: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

interface ProductImageManagerProps {
  /**
   * Initial images to display (from database)
   */
  initialImages?: ProductImage[];
  maxFiles?: number;
  /**
   * Callback when images change. Returns the complete array of images.
   * Parent form should handle the actual saving on form submit.
   */
  onImagesChange: (images: ProductImage[]) => void;
  /**
   * If true, uploads happen immediately. If false (default), files are stored
   * for batch upload on form submit.
   */
  immediateUpload?: boolean;
}

interface ImageState extends ProductImage {
  isLoading?: boolean;
  isNew?: boolean;
  file?: File; // For lazy upload
}

/**
 * ProductImageManager - Lazy Image Management Component
 *
 * This component implements "Lazy Remove" behavior:
 * - Removing an image only updates local state (no immediate API call)
 * - The parent form handles actual deletion when Save is clicked
 * - Uses the "Diff & Clean" pattern in the service layer for safe deletion
 */
export function ProductImageManager({
  initialImages = [],
  maxFiles = 10,
  onImagesChange,
  immediateUpload = false,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ImageState[]>(
    initialImages.map((img) => ({
      ...img,
      isLoading: false,
      isNew: false,
    })),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Notify parent of changes (only non-loading, clean images)
  useEffect(() => {
    const cleanImages = images
      .filter((img) => !img.isLoading)
      .map(({ isLoading, isNew, file, ...rest }) => rest);
    onImagesChange(cleanImages);
  }, [images, onImagesChange]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.secureUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(img.secureUrl);
        }
      });
    };
  }, []);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          setUploadError("Only image files are allowed");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("File size must be less than 5MB");
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      if (images.length + validFiles.length > maxFiles) {
        setUploadError(`Maximum ${maxFiles} images allowed`);
        return;
      }

      setUploadError(null);

      if (immediateUpload) {
        // Immediate upload mode: upload to Cloudinary right away
        setIsUploading(true);
        for (const file of validFiles) {
          try {
            const preview = URL.createObjectURL(file);
            const tempId = `temp-${Date.now()}-${Math.random()}`;
            const tempImage: ImageState = {
              id: tempId,
              secureUrl: preview,
              publicId: "",
              isPrimary: images.length === 0,
              sortOrder: images.length,
              createdAt: new Date().toISOString(),
              isLoading: true,
              isNew: true,
            };
            setImages((prev) => [...prev, tempImage]);

            const uploadResponse = await uploadImageToCloudinary(file);

            setImages((prev) =>
              prev.map((img) =>
                img.id === tempId
                  ? {
                      ...img,
                      publicId: uploadResponse.public_id,
                      secureUrl: uploadResponse.secure_url,
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
            setImages((prev) => prev.filter((img) => !img.isLoading));
          }
        }
        setIsUploading(false);
      } else {
        // Lazy upload mode: store files for batch upload on form submit
        const newImages: ImageState[] = validFiles.map((file, index) => {
          const preview = URL.createObjectURL(file);
          return {
            id: `temp-${Date.now()}-${index}-${Math.random()}`,
            secureUrl: preview,
            publicId: "", // Will be assigned after upload
            isPrimary: images.length === 0 && index === 0,
            sortOrder: images.length + index,
            createdAt: new Date().toISOString(),
            isLoading: false,
            isNew: true,
            file, // Store file for later upload
          };
        });

        setImages((prev) => [...prev, ...newImages]);
      }

      setSuccessMessage(
        `${validFiles.length} image(s) ${immediateUpload ? "uploaded" : "added"}`,
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    [images.length, maxFiles, immediateUpload],
  );

  /**
   * LAZY REMOVE: Only updates local state.
   * No API call is made here. The parent form's onSubmit will handle
   * the actual deletion via the "Diff & Clean" pattern in the service layer.
   */
  const handleRemoveImage = (index: number) => {
    const image = images[index];
    if (image.isLoading) return;

    // Cleanup blob URL if it exists
    if (image.secureUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(image.secureUrl);
    }

    const wasPrimary = image.isPrimary;
    const newImages = images.filter((_, i) => i !== index);

    // If we deleted the primary image, set the first remaining as primary
    if (wasPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    // Update sort orders
    newImages.forEach((img, i) => {
      img.sortOrder = i;
    });

    setImages(newImages);
    setSuccessMessage("Image removed (will be deleted on save)");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  /**
   * Set an image as primary (local state only)
   */
  const handleSetPrimary = (index: number) => {
    const image = images[index];
    if (image.isLoading || image.isPrimary) return;

    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    );
    setSuccessMessage("Primary image updated");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  /**
   * Get pending files for upload (for parent form to use)
   */
  const getPendingUploads = useCallback(() => {
    return images.filter((img) => img.isNew && img.file);
  }, [images]);

  // Drag and drop reordering (local state only)
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  /**
   * Drag end - update sort orders locally (no API call)
   */
  const handleDragEnd = () => {
    if (draggedIndex === null) return;

    // Update sort order in local state only
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        sortOrder: i,
      })),
    );

    setDraggedIndex(null);
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-blue-400");
  };

  const handleDropZoneDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-blue-400");
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-2", "ring-blue-400");
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={handleDropZoneDrop}
        className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors dark:border-gray-600 dark:bg-gray-900"
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
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          ) : (
            <Upload className="h-10 w-10 text-gray-400" />
          )}
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {isUploading
              ? "Uploading..."
              : "Drop images here or click to upload"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {images.length}/{maxFiles} images • Max 5MB per image • Drag to
            reorder
          </p>
        </div>
      </div>

      {/* Messages */}
      {uploadError && (
        <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300">
            {uploadError}
          </span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            {successMessage}
          </span>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable={!image.isLoading}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 transition-all dark:bg-gray-800 ${
                image.isPrimary
                  ? "border-yellow-400 ring-2 ring-yellow-200"
                  : "border-transparent hover:border-gray-300"
              } ${draggedIndex === index ? "opacity-50" : ""}`}
            >
              {/* Image */}
              <img
                src={image.secureUrl}
                alt={`Product ${index + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <Badge className="absolute left-1 top-1 bg-yellow-500 text-white hover:bg-yellow-600">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  Primary
                </Badge>
              )}

              {/* Loading Overlay */}
              {image.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}

              {/* Action Buttons - shown on hover */}
              {!image.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                  {/* Drag Handle */}
                  <div className="absolute left-1 top-1 cursor-move rounded bg-white/90 p-1 text-gray-600">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Set as Primary */}
                  {!image.isPrimary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 px-2"
                      onClick={() => handleSetPrimary(index)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Primary
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !isUploading && (
        <p className="text-center text-sm text-muted-foreground">
          No images uploaded yet. Upload your first product image above.
        </p>
      )}
    </div>
  );
}
