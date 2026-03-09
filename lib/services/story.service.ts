import cloudinary from "@/lib/cloudinary";
/**
 * Story Service
 *
 * Manages story CRUD operations and retrieval for the media gallery.
 */
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { unstable_cache } = require("next/cache");

type StoryDelegate = {
  create: (args: { data: StoryInput }) => Promise<StoryEntity>;
  findMany: (args?: {
    where?: { isActive?: boolean };
    orderBy?: { createdAt: "asc" | "desc" };
  }) => Promise<StoryEntity[]>;
  findUnique: (args: {
    where: { id: string };
    select?: { mediaPublicId?: boolean; mediaType?: boolean };
  }) => Promise<unknown>;
  update: (args: {
    where: { id: string };
    data: Partial<StoryInput>;
  }) => Promise<StoryEntity>;
  delete: (args: { where: { id: string } }) => Promise<StoryEntity>;
};

type StoryEntity = {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaPublicId: string;
  mediaType: "IMAGE" | "VIDEO";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type StoryMediaSelection = {
  mediaPublicId: string | null;
  mediaType: "IMAGE" | "VIDEO";
};

type StoryRow = {
  id: string;
  title: string;
  description: string | null;
  media_url?: string;
  mediaUrl?: string;
  media_public_id?: string;
  mediaPublicId?: string;
  media_type?: "IMAGE" | "VIDEO";
  mediaType?: "IMAGE" | "VIDEO";
  is_active?: boolean;
  isActive?: boolean;
  created_at?: Date;
  createdAt?: Date;
  updated_at?: Date;
  updatedAt?: Date;
};

function getStoryDelegate(): StoryDelegate | null {
  const candidate = (prisma as unknown as { story?: StoryDelegate }).story;
  return candidate ?? null;
}

function mapStoryRow(row: StoryRow): StoryEntity {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    mediaUrl: row.media_url ?? row.mediaUrl ?? "",
    mediaPublicId: row.media_public_id ?? row.mediaPublicId ?? "",
    mediaType: row.media_type ?? row.mediaType ?? "IMAGE",
    isActive: row.is_active ?? row.isActive ?? false,
    createdAt: row.created_at ?? row.createdAt ?? new Date(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date(),
  };
}

export interface StoryInput {
  title: string;
  description?: string | null;
  mediaUrl: string;
  mediaPublicId: string;
  mediaType: "IMAGE" | "VIDEO";
  isActive?: boolean;
}

/**
 * Create a new story
 */
export async function createStory(input: StoryInput) {
  const story = getStoryDelegate();
  if (!story) {
    throw new Error(
      "Story delegate is unavailable. Please restart the dev server and run prisma generate.",
    );
  }

  return story.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      mediaUrl: input.mediaUrl,
      mediaPublicId: input.mediaPublicId,
      mediaType: input.mediaType,
      isActive: input.isActive ?? true,
    },
  });
}

/**
 * Get all stories (admin — includes inactive)
 */
async function _getStories() {
  const story = getStoryDelegate();
  if (story) {
    return story.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // Fallback for environments where Prisma delegate isn't hot-reloaded yet.
  const rows = await prisma.$queryRaw<StoryRow[]>`
    SELECT *
    FROM stories
    ORDER BY created_at DESC
  `;
  return rows.map(mapStoryRow);
}

export function getStories() {
  return unstable_cache(() => _getStories(), ["stories-all"], {
    tags: ["stories:all"],
    revalidate: 120,
  })();
}

/**
 * Get active stories only (public gallery)
 */
async function _getActiveStories() {
  const story = getStoryDelegate();
  if (story) {
    return story.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Fallback for environments where Prisma delegate isn't hot-reloaded yet.
  const rows = await prisma.$queryRaw<StoryRow[]>`
    SELECT *
    FROM stories
    ORDER BY created_at DESC
  `;
  return rows.map(mapStoryRow).filter((storyRow) => storyRow.isActive);
}

export function getActiveStories() {
  return unstable_cache(() => _getActiveStories(), ["stories-active"], {
    tags: ["stories:all"],
    revalidate: 120,
  })();
}

/**
 * Get story by ID
 */
export async function getStoryById(id: string) {
  const story = getStoryDelegate();
  if (story) {
    return story.findUnique({
      where: { id },
    }) as Promise<StoryEntity | null>;
  }

  const rows = await prisma.$queryRaw<StoryRow[]>`
    SELECT *
    FROM stories
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ? mapStoryRow(rows[0]) : null;
}

/**
 * Update story
 */
export async function updateStory(id: string, input: Partial<StoryInput>) {
  const story = getStoryDelegate();
  if (!story) {
    throw new Error(
      "Story delegate is unavailable. Please restart the dev server and run prisma generate.",
    );
  }

  // If we're replacing the media, delete the old one from Cloudinary
  if (input.mediaUrl !== undefined && input.mediaPublicId !== undefined) {
    const existing = (await story.findUnique({
      where: { id },
      select: { mediaPublicId: true, mediaType: true },
    })) as StoryMediaSelection | null;

    if (
      existing?.mediaPublicId &&
      existing.mediaPublicId !== input.mediaPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(existing.mediaPublicId, {
          resource_type: existing.mediaType === "VIDEO" ? "video" : "image",
          invalidate: true,
        });
      } catch (err) {
        console.error("Failed to delete old story media:", err);
      }
    }
  }

  return story.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.mediaUrl !== undefined && { mediaUrl: input.mediaUrl }),
      ...(input.mediaPublicId !== undefined && {
        mediaPublicId: input.mediaPublicId,
      }),
      ...(input.mediaType !== undefined && { mediaType: input.mediaType }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
  });
}

/**
 * Delete story
 *
 * Removes the story media from Cloudinary (handles both images and videos)
 * before deleting the database record.
 */
export async function deleteStory(id: string) {
  const storyDelegate = getStoryDelegate();
  if (!storyDelegate) {
    throw new Error(
      "Story delegate is unavailable. Please restart the dev server and run prisma generate.",
    );
  }

  const story = (await storyDelegate.findUnique({
    where: { id },
    select: { mediaPublicId: true, mediaType: true },
  })) as StoryMediaSelection | null;

  if (!story) {
    throw new Error("Story not found");
  }

  // Delete media from Cloudinary with appropriate resource_type
  if (story.mediaPublicId) {
    try {
      console.log(
        `Deleting ${story.mediaType.toLowerCase()} from Cloudinary: ${story.mediaPublicId}`,
      );
      await cloudinary.uploader.destroy(story.mediaPublicId, {
        resource_type: story.mediaType === "VIDEO" ? "video" : "image",
        invalidate: true,
      });
      console.log("Cloudinary deletion successful");
    } catch (err) {
      console.error("Failed to delete story media from Cloudinary:", err);
      // Continue with database deletion even if Cloudinary fails
    }
  }

  return storyDelegate.delete({ where: { id } });
}
