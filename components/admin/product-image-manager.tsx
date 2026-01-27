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
import {
  saveProductImage,
  deleteProductImage,
  getProductImages,
  setPrimaryImage,
  updateImageOrder,
} from "@/app/actions/imageActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProductImage {
  id: string;
  secureUrl: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  uploadedAt: string;
}

interface ProductImageManagerProps {
  productId: string;
  maxFiles?: number;
  onImagesChange?: (images: ProductImage[]) => void;
}

interface ImageState extends ProductImage {
  isLoading?: boolean;
  isNew?: boolean;
}

export function ProductImageManager({
  productId,
  maxFiles = 10,
  onImagesChange,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ImageState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Load existing images on mount
  useEffect(() => {
    const loadImages = async () => {
      const result = await getProductImages(productId);
      if (result.success && result.data) {
        setImages(
          result.data.map((img) => ({
            ...img,
            isLoading: false,
            isNew: false,
          })),
        );
      }
      setIsLoadingImages(false);
    };
    loadImages();
  }, [productId]);

  // Notify parent of changes
  useEffect(() => {
    if (onImagesChange) {
      const cleanImages = images
        .filter((img) => !img.isLoading)
        .map(({ isLoading, isNew, ...rest }) => rest);
      onImagesChange(cleanImages);
    }
  }, [images, onImagesChange]);

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

      setIsUploading(true);
      setUploadError(null);

      for (const file of validFiles) {
        try {
          // Create preview immediately
          const preview = URL.createObjectURL(file);
          const tempId = `temp-${Date.now()}-${Math.random()}`;
          const tempImage: ImageState = {
            id: tempId,
            secureUrl: preview,
            publicId: "",
            isPrimary: false,
            sortOrder: images.length,
            uploadedAt: new Date().toISOString(),
            isLoading: true,
            isNew: true,
          };
          setImages((prev) => [...prev, tempImage]);

          // Upload to Cloudinary
          const uploadResponse = await uploadImageToCloudinary(file);

          // Save to database
          const isPrimary = images.length === 0; // First image is primary
          const result = await saveProductImage({
            productId,
            secureUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            isPrimary,
            sortOrder: images.length,
          });

          if (result.success && result.data) {
            // Update the image state with actual data
            setImages((prev) =>
              prev.map((img) =>
                img.id === tempId
                  ? {
                      id: result.data!.id,
                      secureUrl: result.data!.secureUrl,
                      publicId: result.data!.publicId,
                      isPrimary: result.data!.isPrimary,
                      sortOrder: result.data!.sortOrder,
                      uploadedAt: result.data!.uploadedAt,
                      isLoading: false,
                      isNew: false,
                    }
                  : img,
              ),
            );
          } else {
            throw new Error(result.error || "Failed to save image");
          }
        } catch (error) {
          console.error("Upload error:", error);
          setUploadError(
            error instanceof Error ? error.message : "Upload failed",
          );
          // Remove failed image from state
          setImages((prev) => prev.filter((img) => !img.isLoading));
        }
      }

      setIsUploading(false);
      setSuccessMessage(`Successfully uploaded ${validFiles.length} image(s)`);
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    [images.length, maxFiles, productId],
  );

  const handleRemoveImage = async (index: number) => {
    const image = images[index];
    if (image.isLoading) return;

    try {
      await deleteProductImage(image.id, image.publicId);

      const wasPrimary = image.isPrimary;
      const newImages = images.filter((_, i) => i !== index);

      // If we deleted the primary image, set the first remaining as primary
      if (wasPrimary && newImages.length > 0) {
        await setPrimaryImage(newImages[0].id, productId);
        newImages[0].isPrimary = true;
      }

      setImages(newImages);
      setSuccessMessage("Image deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setUploadError("Failed to delete image");
    }
  };

  const handleSetPrimary = async (index: number) => {
    const image = images[index];
    if (image.isLoading || image.isPrimary) return;

    try {
      await setPrimaryImage(image.id, productId);
      setImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          isPrimary: i === index,
        })),
      );
      setSuccessMessage("Primary image updated");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Set primary error:", error);
      setUploadError("Failed to set primary image");
    }
  };

  // Drag and drop reordering
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

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    // Update sort order in database
    const imageOrders = images.map((img, i) => ({
      id: img.id,
      sortOrder: i,
    }));

    try {
      await updateImageOrder(imageOrders);
      setImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          sortOrder: i,
        })),
      );
    } catch (error) {
      console.error("Reorder error:", error);
      setUploadError("Failed to save image order");
    }

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

  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading images...</span>
      </div>
    );
  }

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
