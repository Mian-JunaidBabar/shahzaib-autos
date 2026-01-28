"use client";

import { useState, useEffect, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
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
import { Skeleton } from "@/components/ui/skeleton";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";
import {
  getServiceAction,
  updateServiceAction,
} from "@/app/actions/serviceActions";
import { toast } from "sonner";

interface UploadedImage {
  url: string;
  publicId: string;
  isLoading?: boolean;
}

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    duration: "",
    isActive: true,
  });

  useEffect(() => {
    const loadService = async () => {
      setIsLoading(true);
      const result = await getServiceAction(id);

      if (result.success && result.data) {
        const service = result.data;
        setForm({
          title: service.title,
          slug: service.slug,
          description: service.description || "",
          price: service.price.toString(),
          duration: service.duration.toString(),
          isActive: service.isActive,
        });

        if (service.imageUrl) {
          setUploadedImage({
            url: service.imageUrl,
            publicId: service.imagePublicId || "",
            isLoading: false,
          });
        }
      } else {
        setSubmitError(result.error || "Failed to load service");
      }

      setIsLoading(false);
    };

    loadService();
  }, [id]);

  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => {
      if (field === "slug" && typeof value === "string") {
        return { ...prev, slug: normalizeSlug(value) };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      return;
    }

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
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";

    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) return "Price must be a positive number";

    const duration = parseInt(form.duration, 10);
    if (isNaN(duration) || duration <= 0)
      return "Duration must be a positive number (in minutes)";

    return null;
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitError(null);
    startTransition(async () => {
      const price = parseFloat(form.price);
      const duration = parseInt(form.duration, 10);

      const result = await updateServiceAction({
        id,
        title: form.title,
        slug: form.slug || undefined,
        description: form.description || undefined,
        price,
        duration,
        imageUrl: uploadedImage?.url || null,
        imagePublicId: uploadedImage?.publicId || null,
        isActive: form.isActive,
      });

      if (result.success) {
        toast.success("Service updated successfully");
        router.push("/admin/dashboard/services");
      } else {
        setSubmitError(result.error || "Failed to update service");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/services">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Service</h1>
          <p className="text-muted-foreground mt-1">Update service details</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Ceramic Coating"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="Auto-generated from title"
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs: /services/{form.slug || "..."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the service..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (PKR) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="100"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="5000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    step="15"
                    value={form.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="60"
                    className="pl-10"
                  />
                </div>
                {form.duration && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {Math.floor(parseInt(form.duration) / 60)}h{" "}
                    {parseInt(form.duration) % 60}m
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Show this service on the public page
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
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

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {submitError}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Link href="/admin/dashboard/services">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSubmit} disabled={isPending || isUploadingImage}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
