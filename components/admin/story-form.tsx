"use client";

/**
 * StoryForm
 *
 * Shared form used by:
 *   - /admin/dashboard/stories/new       (create)
 *   - /admin/dashboard/stories/[id]/edit (edit)
 *
 * Features:
 *  - Title and description
 *  - Single media upload (image or video) via Cloudinary
 *  - Active toggle
 */

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Save, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  createStoryAction,
  updateStoryAction,
} from "@/app/actions/storyActions";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StoryData {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaPublicId: string;
  mediaType: "IMAGE" | "VIDEO";
  isActive: boolean;
}

type StoryFormValues = {
  title: string;
  description: string;
  isActive: boolean;
};

interface StoryFormProps {
  initialData?: StoryData;
}

// ---------------------------------------------------------------------------
// Cloudinary Upload Helper
// ---------------------------------------------------------------------------

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
  [key: string]: unknown;
}

async function uploadMediaToCloudinary(
  file: File,
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Check environment variables.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "shahzaib-electronics/stories");

  // Determine resource type (image or video)
  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let errorMessage = "Failed to upload media to Cloudinary";
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = `Cloudinary Error: ${errorData.error.message}`;
      }
    } catch {
      // If response isn't JSON, use default error message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return {
    public_id: data.public_id,
    secure_url: data.secure_url,
    resource_type: data.resource_type || resourceType,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StoryForm({ initialData }: StoryFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Media state
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    initialData?.mediaUrl ?? null,
  );
  const [mediaPublicId, setMediaPublicId] = useState<string | null>(
    initialData?.mediaPublicId ?? null,
  );
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO" | null>(
    initialData?.mediaType ?? null,
  );
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null);
  const [newMediaPreview, setNewMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useForm<StoryFormValues>({
    defaultValues: isEdit
      ? {
          title: initialData.title,
          description: initialData.description ?? "",
          isActive: initialData.isActive,
        }
      : {
          title: "",
          description: "",
          isActive: true,
        },
  });

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);
    };
  }, [newMediaPreview]);

  // ---------------------------------------------------------------------------
  // Media handling
  // ---------------------------------------------------------------------------

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Only image and video files are allowed");
      return;
    }

    // File size limits
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for image
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size: ${isVideo ? "50MB" : "10MB"}`);
      return;
    }

    // Clear old preview
    if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);

    setNewMediaFile(file);
    setNewMediaPreview(URL.createObjectURL(file));
    setMediaType(isImage ? "IMAGE" : "VIDEO");
  };

  const handleRemoveMedia = () => {
    if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);
    setNewMediaFile(null);
    setNewMediaPreview(null);
    setMediaUrl(null);
    setMediaPublicId(null);
    setMediaType(null);
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function applyServerIssues(raw?: string) {
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return false;

      let firstField: keyof StoryFormValues | null = null;

      parsed.forEach(
        (issue: { path?: (string | number)[]; message?: string }) => {
          const issuePath = issue.path || [];
          if (!Array.isArray(issuePath) || issuePath.length === 0) return;

          const fieldName = String(issuePath[0]);
          const message = issue.message || "Invalid value";

          if (fieldName === "title") {
            setError(fieldName, { type: "server", message });
            if (!firstField) firstField = fieldName;
          } else {
            setSubmitError(message);
          }
        },
      );

      if (firstField) {
        setSubmitError("Please correct the highlighted fields.");
        setFocus(firstField);
      }

      return true;
    } catch {
      return false;
    }
  }

  const onSubmit = (data: StoryFormValues) => {
    // Validate media is present
    if (!isEdit && !newMediaFile) {
      toast.error("Please select an image or video");
      return;
    }

    setSubmitError(null);
    clearErrors();
    startTransition(async () => {
      try {
        let finalMediaUrl = mediaUrl;
        let finalMediaPublicId = mediaPublicId;
        let finalMediaType = mediaType;

        // Upload new media if selected
        if (newMediaFile) {
          setIsUploading(true);
          try {
            const upload = await uploadMediaToCloudinary(newMediaFile);
            finalMediaUrl = upload.secure_url;
            finalMediaPublicId = upload.public_id;
            finalMediaType =
              upload.resource_type === "video" ? "VIDEO" : "IMAGE";
          } catch (err) {
            console.error("Media upload error:", err);
            toast.error(
              err instanceof Error ? err.message : "Failed to upload media",
            );
            setIsUploading(false);
            return;
          }
          setIsUploading(false);
        }

        if (!finalMediaUrl || !finalMediaPublicId || !finalMediaType) {
          toast.error("Media upload failed. Please try again.");
          return;
        }

        const payload = {
          title: data.title.trim(),
          description: data.description?.trim() || null,
          mediaUrl: finalMediaUrl,
          mediaPublicId: finalMediaPublicId,
          mediaType: finalMediaType,
          isActive: data.isActive,
        };

        if (isEdit) {
          const result = await updateStoryAction(initialData.id, payload);
          if (!result.success) {
            const handledIssues = applyServerIssues(result.error);
            if (!handledIssues) {
              setSubmitError(result.error || "Failed to update story");
              toast.error(result.error || "Failed to update story");
            } else {
              toast.error("Please fix the highlighted fields.");
            }
            return;
          }
          toast.success("Story updated");
        } else {
          const result = await createStoryAction(payload);
          if (!result.success) {
            const handledIssues = applyServerIssues(result.error);
            if (!handledIssues) {
              setSubmitError(result.error || "Failed to create story");
              toast.error(result.error || "Failed to create story");
            } else {
              toast.error("Please fix the highlighted fields.");
            }
            return;
          }
          toast.success("Story created");
        }

        router.push("/admin/dashboard/stories");
      } catch (error) {
        console.error("StoryForm submit error:", error);
        const msg =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setSubmitError(msg);
        toast.error(msg);
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const displayMedia = newMediaPreview || mediaUrl;
  const displayType = newMediaFile
    ? newMediaFile.type.startsWith("video/")
      ? "VIDEO"
      : "IMAGE"
    : mediaType;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Story" : "Add Story"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update story details and media."
              : "Create a new story for the gallery."}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/stories">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
      </div>

      {submitError && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{submitError}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Story Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="required">
                  Title
                </Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter story title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Optional description or caption"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Media (Image or Video)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayMedia ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border bg-muted">
                    {displayType === "VIDEO" ? (
                      <video
                        src={displayMedia}
                        controls
                        className="w-full aspect-video object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={displayMedia}
                          alt="Story media"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveMedia}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" /> Remove Media
                  </Button>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="mediaFile"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                      <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Images: JPG, PNG, WebP (max 10MB)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Videos: MP4, MOV (max 50MB)
                      </p>
                    </div>
                    <input
                      id="mediaFile"
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </label>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Status */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active
                </Label>
                <Switch id="isActive" {...register("isActive")} />
              </div>
              <p className="text-xs text-muted-foreground">
                Only active stories are visible on the public gallery.
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isUploading}
          >
            {isPending || isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUploading
                  ? "Uploading..."
                  : isEdit
                    ? "Updating..."
                    : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isEdit ? "Update Story" : "Create Story"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
