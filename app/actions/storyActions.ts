/**
 * Story Server Actions
 *
 * RBAC-protected actions for story (media gallery) management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/services/auth.service";
import * as StoryService from "@/lib/services/story.service";
import {
  storyCreateSchema,
  storyUpdateSchema,
  StoryCreateInput,
  StoryUpdateInput,
} from "@/lib/validations/story.validation";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all stories (admin)
 */
export async function getStoriesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof StoryService.getStories>>>
> {
  try {
    const stories = await StoryService.getStories();
    return { success: true, data: stories };
  } catch (error) {
    console.error("getStoriesAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stories",
    };
  }
}

/**
 * Get active stories only (public)
 */
export async function getActiveStoriesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof StoryService.getActiveStories>>>
> {
  try {
    const stories = await StoryService.getActiveStories();
    return { success: true, data: stories };
  } catch (error) {
    console.error("getActiveStoriesAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch active stories",
    };
  }
}

/**
 * Get single story by ID
 */
export async function getStoryAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof StoryService.getStoryById>>>
> {
  try {
    const story = await StoryService.getStoryById(id);
    if (!story) {
      return { success: false, error: "Story not found" };
    }
    return { success: true, data: story };
  } catch (error) {
    console.error("getStoryAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch story",
    };
  }
}

/**
 * Create story (admin only)
 */
export async function createStoryAction(
  input: StoryCreateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = storyCreateSchema.parse(input);
    const story = await StoryService.createStory(validated);

    revalidatePath("/admin/dashboard/stories");
    revalidatePath("/(public)/stories");
    revalidateTag(
      "stories:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );

    return { success: true, data: { id: story.id } };
  } catch (error) {
    console.error("createStoryAction error:", error);

    if (error instanceof ZodError) {
      return { success: false, error: JSON.stringify(error.issues) };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create story",
    };
  }
}

/**
 * Update story (admin only)
 */
export async function updateStoryAction(
  id: string,
  input: StoryUpdateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = storyUpdateSchema.parse(input);
    const story = await StoryService.updateStory(id, validated);

    revalidatePath("/admin/dashboard/stories");
    revalidatePath("/(public)/stories");
    revalidateTag(
      "stories:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );

    return { success: true, data: { id: story.id } };
  } catch (error) {
    console.error("updateStoryAction error:", error);

    if (error instanceof ZodError) {
      return { success: false, error: JSON.stringify(error.issues) };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update story",
    };
  }
}

/**
 * Delete story (admin only)
 */
export async function deleteStoryAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    await StoryService.deleteStory(id);

    revalidatePath("/admin/dashboard/stories");
    revalidatePath("/(public)/stories");
    revalidateTag(
      "stories:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );

    return { success: true };
  } catch (error) {
    console.error("deleteStoryAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete story",
    };
  }
}
