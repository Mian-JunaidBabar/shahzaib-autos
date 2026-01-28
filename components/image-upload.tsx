"use client";

import { useState, useEffect } from "react";
import { Upload, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

export interface UploadedImage {
  id: string;
  secureUrl: string;
  publicId: string;
  uploadedAt: string;
}

interface ImageUploadProps {
  productId?: string;
  onImagesUpload?: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

interface ImageState {
  file: File;
  preview: string;
}

/**
 * ImageUpload Component - Local Preview Only
 *
 * This component handles file selection and creates local previews using URL.createObjectURL.
 * Actual upload to Cloudinary happens in the parent form's onSubmit handler.
 * This prevents orphaned images in cloud storage if users cancel the form.
 */
export function ImageUpload({
  productId,
  onImagesUpload,
  maxFiles = 5,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageState[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  const handleFileSelect = (files: FileList | null) => {
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

    setUploadError(null);

    // Create local previews only
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-4">
      {/* File Input Area */}
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">
          Click to upload or drag and drop
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          Max 5MB, JPG/PNG
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </label>

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 rounded">
          <AlertCircle className="h-4 w-4" />
          {uploadError}
        </div>
      )}

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Count */}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length}/{maxFiles} images selected (will upload on save)
        </p>
      )}
    </div>
  );
}
