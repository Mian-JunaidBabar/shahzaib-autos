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
  Banknote,
  Home,
  Wrench,
  CheckSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";
import {
  createServiceAction,
  updateServiceAction,
} from "@/app/actions/serviceActions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema with coercion for number inputs
const serviceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
  location: z.enum(["WORKSHOP", "HOME", "BOTH"]),
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
  location?: "WORKSHOP" | "HOME" | "BOTH";
  features?: string[];
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

  // Features management
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || [],
  );
  const [newFeature, setNewFeature] = useState("");

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
      location: initialData?.location || "BOTH",
      isActive: initialData?.isActive ?? true,
    },
  });

  const isActive = watch("isActive");
  const duration = watch("duration");
  const location = watch("location");

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

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ServiceFormData) => {
    startTransition(async () => {
      const payload = {
        title: data.title,
        slug: undefined, // Auto-generated from title
        description: data.description || undefined,
        price: data.price,
        duration: data.duration,
        location: data.location,
        features,
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-6xl mx-auto"
    >
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
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Service Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Premium Ceramic Coating"
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
                  placeholder="Describe the process, tools used, and benefits..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Describe the process, tools used, and benefits
                </p>
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* What's Included */}
              <div className="space-y-2">
                <Label>What&apos;s Included?</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g., 6 Months Warranty"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded-md"
                      >
                        <CheckSquare className="h-4 w-4 text-green-600" />
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Add features like warranty, parts included, or free services
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Logistics */}
          <Card>
            <CardHeader>
              <CardTitle>Service Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Starting Price (PKR) *</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="100"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="5000"
                      className="pl-10"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Minutes) *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      step="15"
                      {...register("duration", { valueAsNumber: true })}
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
                      ≈ {Math.floor(Number(duration) / 60)}h{" "}
                      {Number(duration) % 60}m
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Service Location *</Label>
                <Select
                  value={location}
                  onValueChange={(value: "WORKSHOP" | "HOME" | "BOTH") =>
                    setValue("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WORKSHOP">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        <span>Workshop Only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="HOME">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Home Service Only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="BOTH">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Available at Both</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
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
        </div>

        {/* Right Column - Image */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Service Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedImage ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border">
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
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
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
      </div>
    </form>
  );
}
