"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
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
  Star,
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

// Image state for managing uploads
interface ImageState {
  id: string; // Temp or actual ID
  secureUrl: string; // Current URL (blob or actual)
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  isLoading?: boolean;
  isNew?: boolean;
  file?: File; // For new uploads
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
  images?: Array<{
    id: string;
    secureUrl: string;
    publicId: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: string;
  }>;
  isActive: boolean;
}

interface ServiceFormProps {
  initialData?: Service;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Image management
  const [images, setImages] = useState<ImageState[]>(
    initialData?.images?.map((img) => ({
      ...img,
      isLoading: false,
      isNew: false,
    })) || [],
  );
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

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.secureUrl && img.secureUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.secureUrl);
        }
      });
    };
  }, []);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newImages: ImageState[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError("Only image files are allowed");
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("File size must be less than 5MB");
          continue;
        }

        const preview = URL.createObjectURL(file);
        const tempId = `temp-${Date.now()}-${Math.random()}`;

        newImages.push({
          id: tempId,
          secureUrl: preview,
          publicId: "",
          isPrimary: images.length === 0 && newImages.length === 0,
          sortOrder: images.length + newImages.length,
          createdAt: new Date().toISOString(),
          isLoading: false,
          isNew: true,
          file,
        });
      }

      if (newImages.length > 0) {
        setUploadError(null);
        setImages((prev) => [...prev, ...newImages]);
      }
    },
    [images.length],
  );

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      // Cleanup blob URL if it exists
      const removed = prev.find((img) => img.id === id);
      if (removed && removed.secureUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removed.secureUrl);
      }
      // Reset primary if removed was primary
      if (removed?.isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      })),
    );
  };

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
      try {
        // Validate that we have at least one image
        if (images.length === 0) {
          toast.error("Please add at least one image");
          return;
        }

        // Upload new images first
        const uploadedImages: Array<{ publicId: string; secureUrl: string }> =
          [];
        const imagesToUpload = images.filter((img) => img.isNew && img.file);

        for (const imgState of imagesToUpload) {
          if (!imgState.file) continue;

          try {
            toast.info(
              `Uploading image ${imagesToUpload.indexOf(imgState) + 1}/${imagesToUpload.length}...`,
            );
            const uploadResponse = await uploadImageToCloudinary(imgState.file);
            uploadedImages.push({
              publicId: uploadResponse.public_id,
              secureUrl: uploadResponse.secure_url,
            });
          } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Failed to upload image");
            return;
          }
        }

        // Combine uploaded images with existing ones
        const allImages = images.map((img, idx) => {
          if (img.isNew && img.file) {
            const uploaded = uploadedImages.find(
              (u) =>
                images.indexOf(images.find((x) => x.file === img.file)!) ===
                idx,
            );
            return (
              uploaded || { publicId: img.publicId, secureUrl: img.secureUrl }
            );
          }
          return {
            publicId: img.publicId,
            secureUrl: img.secureUrl,
          };
        });

        const payload = {
          title: data.title,
          slug: undefined, // Auto-generated from title
          description: data.description || undefined,
          price: data.price,
          duration: data.duration,
          location: data.location,
          features,
          images: allImages,
          isActive: data.isActive,
        };

        const result = initialData
          ? await updateServiceAction({
              id: initialData.id,
              ...payload,
              keepImagePublicIds: images
                .filter((img) => !img.isNew)
                .map((img) => img.publicId),
            })
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
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Failed to save service");
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
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {images.some((img) => img.isNew && img.file)
                ? "Uploading..."
                : "Saving..."}
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

        {/* Right Column - Images */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Service Images</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to add images
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Max 5MB, JPG/PNG • Multiple allowed
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              {/* Error Message */}
              {uploadError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {uploadError}
                </div>
              )}

              {/* Images List */}
              {images.length > 0 && (
                <div className="space-y-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-md"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={img.secureUrl}
                          alt={`Service image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Image Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          Image {idx + 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {img.isNew ? "Ready to upload" : "Saved"}
                        </p>
                      </div>

                      {/* Primary Button */}
                      <Button
                        type="button"
                        variant={img.isPrimary ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => setPrimaryImage(img.id)}
                        title={
                          img.isPrimary ? "Primary image" : "Set as primary"
                        }
                      >
                        <Star className="h-4 w-4" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-700"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Messages */}
              {images.some((img) => img.isNew && img.file) && (
                <div className="flex items-center gap-2 text-blue-500 text-xs">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>New images will be uploaded on submit</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
