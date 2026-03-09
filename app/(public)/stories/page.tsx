import { getActiveStories } from "@/lib/services/story.service";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Stories | Shahzaib Electronics",
  description:
    "Explore our latest stories, updates, and highlights from Shahzaib Electronics.",
};

// Use Next.js unstable_cache for server-side caching
export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const stories = await getActiveStories();

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-border bg-section-bg pt-8 pb-8 transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary mb-2">
            Our Stories
          </h1>
          <p className="text-text-muted max-w-2xl">
            Explore our latest stories, updates, and highlights from Shahzaib
            Electronics.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-muted-foreground">
                Collections
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">No Stories Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Check back soon for updates and highlights from Shahzaib
              Electronics.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                home
              </span>
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Media Container */}
                <div className="relative w-full aspect-video bg-muted">
                  {story.mediaType === "IMAGE" ? (
                    <Image
                      src={story.mediaUrl}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={story.mediaUrl}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-text-primary mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  {story.description && (
                    <p className="text-text-muted text-sm line-clamp-3">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
