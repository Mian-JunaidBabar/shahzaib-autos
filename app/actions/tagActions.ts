/**
 * Tag Server Actions
 *
 * Actions for fetching and managing product tags.
 */

"use server";

import * as ProductService from "@/lib/services/product.service";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all available tags (for multi-select form component)
 */
export async function getAllTagsAction(): Promise<
  ActionResult<{ id: string; name: string }[]>
> {
  try {
    const tags = await ProductService.getAllTags();
    return {
      success: true,
      data: tags.map((tag) => ({ id: tag.id, name: tag.name })),
    };
  } catch (error) {
    console.error("getAllTagsAction error:", error);
    return {
      success: false,
      error: "Failed to fetch tags. Please try again.",
    };
  }
}
