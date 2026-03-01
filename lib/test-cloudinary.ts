import {
  saveProductImage,
  deleteProductImage,
  getProductImages,
} from "@/app/actions/imageActions";
/**
 * Cloudinary Image Upload System - Test Utilities
 *
 * Use these functions to verify your Cloudinary setup is working correctly
 */
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";

/**
 * Test environment variables are properly configured
 */
export function testEnvironmentVariables(): {
  valid: boolean;
  missing: string[];
  message: string;
} {
  const required = [
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  return {
    valid: missing.length === 0,
    missing,
    message:
      missing.length === 0
        ? "✅ All environment variables configured"
        : `❌ Missing: ${missing.join(", ")}`,
  };
}

/**
 * Test Cloudinary upload functionality
 * Run this in browser console to test frontend upload
 */
export async function testCloudinaryUpload(file: File): Promise<{
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}> {
  try {
    // Verify env vars
    const envCheck = testEnvironmentVariables();
    if (!envCheck.valid) {
      return {
        success: false,
        message: "Environment variables not configured",
        error: envCheck.missing.join(", "),
      };
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "Invalid file type",
        error: "Only image files are allowed",
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: "File too large",
        error: "Maximum file size is 5MB",
      };
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const response = await uploadImageToCloudinary(file);

    return {
      success: true,
      message: "✅ Successfully uploaded to Cloudinary",
      data: {
        public_id: response.public_id,
        secure_url: response.secure_url,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "❌ Cloudinary upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test database connectivity and save functionality
 * Run this as a server action
 * Note: This test requires a valid productId since images are linked to products
 */
export async function testDatabaseConnection(productId?: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  "use server";

  try {
    // If no productId provided, skip image save test and just verify DB connection
    if (!productId) {
      // Test basic database connectivity with a simple query
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      return {
        success: true,
        message: "✅ Database connection successful (no product image test)",
      };
    }

    const result = await saveProductImage({
      productId,
      secureUrl: "https://test.example.com/test.jpg",
      publicId: `test-${Date.now()}`,
    });

    if (!result.success || !result.data?.id) {
      throw new Error(result.error || "Failed to create test image record");
    }

    // Clean up
    await deleteProductImage(result.data.id, result.data.publicId);

    return {
      success: true,
      message: "✅ Database connection successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "❌ Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test complete upload workflow
 * Run this to test the entire system
 * Requires a valid productId to save images to database
 */
export async function testCompleteWorkflow(
  file: File,
  productId?: string,
): Promise<{
  success: boolean;
  steps: {
    name: string;
    success: boolean;
    message: string;
  }[];
  error?: string;
}> {
  const steps: {
    name: string;
    success: boolean;
    message: string;
  }[] = [];

  // Step 1: Environment check
  const envCheck = testEnvironmentVariables();
  steps.push({
    name: "Environment Variables",
    success: envCheck.valid,
    message: envCheck.message,
  });

  if (!envCheck.valid) {
    return {
      success: false,
      steps,
      error: "Environment variables not configured",
    };
  }

  // Step 2: File validation
  const isValidType = file.type.startsWith("image/");
  steps.push({
    name: "File Type Validation",
    success: isValidType,
    message: isValidType
      ? "✅ File is a valid image"
      : "❌ File is not an image",
  });

  const isValidSize = file.size <= 5 * 1024 * 1024;
  steps.push({
    name: "File Size Validation",
    success: isValidSize,
    message: isValidSize
      ? "✅ File size is within limit"
      : "❌ File is too large (max 5MB)",
  });

  if (!isValidType || !isValidSize) {
    return {
      success: false,
      steps,
      error: "File validation failed",
    };
  }

  // Step 3: Cloudinary upload
  let uploadResult = null;
  try {
    uploadResult = await uploadImageToCloudinary(file);
    steps.push({
      name: "Cloudinary Upload",
      success: true,
      message: `✅ Uploaded successfully (ID: ${uploadResult.public_id})`,
    });
  } catch (error) {
    steps.push({
      name: "Cloudinary Upload",
      success: false,
      message: `❌ Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    return {
      success: false,
      steps,
      error: "Cloudinary upload failed",
    };
  }

  // Step 4: Database save
  try {
    if (!productId) {
      steps.push({
        name: "Database Save",
        success: true,
        message: "⏭️ Skipped (no productId provided)",
      });
    } else {
      const result = await saveProductImage({
        productId,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
      if (!result.success) {
        throw new Error(result.error || "Save failed");
      }
      steps.push({
        name: "Database Save",
        success: true,
        message: `✅ Saved to database (ID: ${result.data?.id})`,
      });
    }
  } catch (error) {
    steps.push({
      name: "Database Save",
      success: false,
      message: `❌ Save failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    return {
      success: false,
      steps,
      error: "Database save failed",
    };
  }

  // Step 5: Retrieve images
  try {
    const result = await getProductImages(productId);
    const imageCount = result.success ? result.data?.length || 0 : 0;
    steps.push({
      name: "Retrieve Images",
      success: result.success,
      message: `✅ Retrieved ${imageCount} images from database`,
    });
  } catch (error) {
    steps.push({
      name: "Retrieve Images",
      success: false,
      message: `❌ Retrieval failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    return {
      success: false,
      steps,
      error: "Image retrieval failed",
    };
  }

  return {
    success: true,
    steps,
  };
}

/**
 * Browser console test helper
 * Copy and paste into browser console to test the system
 */
export const consoleTestHelper = `
// Test 1: Environment variables
console.log("Environment Variables:");
console.log(testEnvironmentVariables());

// Test 2: Pick a file and upload
console.log("Select an image file to test upload...");
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const result = await testCloudinaryUpload(file);
    console.log("Upload Result:", result);
  }
};
input.click();

// Test 3: Check database
console.log("Checking database...");
await testDatabaseConnection().then(result => console.log(result));
`;

/**
 * Create a test report
 */
export async function generateTestReport(): Promise<string> {
  const envCheck = testEnvironmentVariables();
  const dbCheck = await testDatabaseConnection();

  const report = `
# Cloudinary Image Upload System - Test Report
Generated: ${new Date().toISOString()}

## Environment Configuration
${envCheck.valid ? "✅ All variables configured" : "❌ Missing: " + envCheck.missing.join(", ")}

## Database Connection
${dbCheck.success ? "✅ Database is connected" : "❌ Database connection failed: " + dbCheck.error}

## Recommendations
${!envCheck.valid ? "- Add missing environment variables to .env.local" : ""}
${!dbCheck.success ? "- Check database connection and Prisma migration status" : ""}
${envCheck.valid && dbCheck.success ? "- System is ready to use!" : ""}

## Next Steps
1. Run migrations: npx prisma migrate dev
2. Test upload at: http://localhost:3000/upload
3. Check browser console for detailed logs
  `;

  return report.trim();
}
