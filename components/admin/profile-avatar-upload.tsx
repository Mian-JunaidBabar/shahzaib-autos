"use client";

import { useState, useRef } from "react";
import { Upload, User, Loader2 } from "lucide-react";
import { uploadAvatarAction } from "@/app/actions/profileActions";
import { useAuth } from "@/context/auth-context";

interface ProfileAvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
}

export function ProfileAvatarUpload({
  currentAvatarUrl,
  onUploadSuccess,
}: ProfileAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null,
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshUser } = useAuth();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatarAction(formData);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Upload failed");
      }

      setPreviewUrl(result.data.avatarUrl);

      // Refresh user data in navbar
      await refreshUser();

      onUploadSuccess?.(result.data.avatarUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setPreviewUrl(currentAvatarUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {/* Avatar Circle */}
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-border bg-muted transition-all ${
            isUploading ? "opacity-50" : "opacity-100"
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-muted-foreground" />
          )}
        </div>

        {/* Upload Overlay */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Change Avatar"}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or GIF. Max 5MB.
      </p>
    </div>
  );
}
