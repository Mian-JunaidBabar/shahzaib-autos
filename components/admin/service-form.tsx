"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";
import {
  createServiceAction,
  updateServiceAction,
} from "@/app/actions/serviceActions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const serviceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive integer (in minutes)"),
  isActive: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface UploadedImage {
  url: string;
  publicId: string;
  isLoading?: boolean;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  duration: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isActive: boolean;
}

interface ServiceFormProps {
  initialData?: Service;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    initialData?.imageUrl
      ? {
          url: initialData.imageUrl,
          publicId: initialData.imagePublicId || "",
          isLoading: false,
        }
      : null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      duration: initialData?.duration || 60,
      isActive: initialData?.isActive ?? true,
    },
  });

  const isActive = watch("isActive");
  const duration = watch("duration");

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      setIsUploadingImage(true);
      setUploadError(null);

      try {
        const preview = URL.createObjectURL(file);
        setUploadedImage({ url: preview, publicId: "", isLoading: true });

        const uploadResponse = await uploadImageToCloudinary(file);

        setUploadedImage({
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          isLoading: false,
        });

        URL.revokeObjectURL(preview);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError("Failed to upload image");
        setUploadedImage(null);
      } finally {
        setIsUploadingImage(false);
      }
    },
    [],
  );

  const removeImage = useCallback(() => {
    setUploadedImage(null);
  }, []);

  const onSubmit = (data: ServiceFormData) => {
    startTransition(async () => {
      const payload = {
        title: data.title,
        slug: undefined, // Auto-generated from title
        description: data.description || undefined,
        price: data.price,
        duration: data.duration,
        imageUrl: uploadedImage?.url || undefined,
        imagePublicId: uploadedImage?.publicId || undefined,
        isActive: data.isActive,
      };

      const result = initialData
        ? await updateServiceAction({ id: initialData.id, ...payload })
        : await createServiceAction(payload);

      if (result.success) {
        toast.success(
          initialData
            ? "Service updated successfully"
            : "Service created successfully",
        );
        router.push("/admin/dashboard/services");
      } else {
        toast.error(result.error || "An error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/services">
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {initialData ? "Edit Service" : "New Service"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {initialData
              ? "Update service details"
              : "Add a new service offering"}
          </p>
        </div>
        <Button type="submit" disabled={isPending || isUploadingImage}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? "Save Changes" : "Create Service"}
            </>
          )}
        </Button>
      </div>

      {/* Form Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Ceramic Coating"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the service..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Starting Price (Rs) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="100"
                    {...register("price")}
                    placeholder="5000"
                    className="pl-10"
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Minutes) *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    step="15"
                    {...register("duration")}
                    placeholder="60"
                    className="pl-10"
                  />
                </div>
                {errors.duration && (
                  <p className="text-sm text-red-500">
                    {errors.duration.message}
                  </p>
                )}
                {duration > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {Math.floor(duration / 60)}h {duration % 60}m
                  </p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Show this service on the public page
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Image */}
        <Card>
          <CardHeader>
            <CardTitle>Service Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={uploadedImage.url}
                  alt="Service preview"
                  fill
                  className="object-cover"
                />
                {uploadedImage.isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  disabled={uploadedImage.isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload image
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Max 5MB, JPG/PNG
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {uploadError}
              </div>
            )}

            {uploadedImage && !uploadedImage.isLoading && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="h-4 w-4" />
                Image ready
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
