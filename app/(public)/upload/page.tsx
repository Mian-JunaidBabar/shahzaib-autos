import { ImageUpload } from "@/components/image-upload";

export default function ImageUploadPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Product Image Upload
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Upload product images to your gallery. Images are stored securely in
            Cloudinary and metadata is saved to your database.
          </p>
        </div>

        {/* Upload Component */}
        <div className="rounded-xl bg-white shadow-lg dark:bg-gray-800">
          <div className="p-8">
            <ImageUpload
              maxFiles={10}
              onImagesUpload={(images) => {
                console.log("Images uploaded:", images);
              }}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-950">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200">
              Secure Storage
            </h3>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              Images are stored securely in Cloudinary with automatic
              optimization and CDN delivery.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-950">
            <h3 className="font-semibold text-green-900 dark:text-green-200">
              Database Tracking
            </h3>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              All image metadata is saved to your Supabase database with
              timestamps and public IDs.
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-6 dark:bg-purple-950">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200">
              Easy Management
            </h3>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              Delete images with a single click. Images are removed from both
              Cloudinary and your database.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            How to Use
          </h2>
          <ol className="mt-6 space-y-4">
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                1
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Drag & Drop or Click
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag images directly or click to browse your files
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                2
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Upload to Cloudinary
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Images are uploaded directly to Cloudinary with automatic
                  optimization
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                3
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Save to Database
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Metadata (URL, public ID) is saved to your Supabase database
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                4
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Manage & Delete
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the X button to delete images from both Cloudinary and
                  your database
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Technical Info */}
        <div className="mt-12 rounded-lg bg-amber-50 p-8 dark:bg-amber-950">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
            ℹ️ Technical Details
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-amber-800 dark:text-amber-300">
            <li>• Images are uploaded using unsigned Cloudinary uploads</li>
            <li>• Maximum 5MB per image, PNG/JPG/WebP/GIF formats supported</li>
            <li>• Up to 10 images per upload session (configurable)</li>
            <li>
              • Images are automatically stored in /am-motors/products folder
            </li>
            <li>
              • Deletion is permanent and removes from both Cloudinary and DB
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
