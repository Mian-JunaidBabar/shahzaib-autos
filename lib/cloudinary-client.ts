// Frontend Cloudinary utilities (unsigned upload) - Safe for client components

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

export async function uploadImageToCloudinary(
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
  formData.append("folder", "am-motors/products");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let errorMessage = "Failed to upload image to Cloudinary";
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
  };
}

export async function getCloudinaryImageUrl(
  publicId: string,
  width?: number,
  height?: number,
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured");
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/fetch`;
  const params = new URLSearchParams();

  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  params.append("q", "auto");
  params.append("f", "auto");

  return `${baseUrl}/${publicId}?${params.toString()}`;
}
