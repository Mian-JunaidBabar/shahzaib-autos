import { MediaType } from "@prisma/client";
/**
 * Story Validation Schemas
 *
 * Zod validation for stories (media gallery) inputs
 */
import { z } from "zod";

// ============ Story Schemas ============

/**
 * Story creation schema
 */
export const storyCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .nullable(),
  mediaUrl: z.string().url("Invalid media URL"),
  mediaPublicId: z.string().min(1, "Media public ID is required"),
  mediaType: z.nativeEnum(MediaType),
  isActive: z.boolean().default(true),
});

/**
 * Story update schema
 */
export const storyUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .nullable(),
  mediaUrl: z.string().url("Invalid media URL").optional(),
  mediaPublicId: z.string().min(1, "Media public ID is required").optional(),
  mediaType: z.nativeEnum(MediaType).optional(),
  isActive: z.boolean().optional(),
});

// ============ TypeScript Types ============

export type StoryCreateInput = z.infer<typeof storyCreateSchema>;
export type StoryUpdateInput = z.infer<typeof storyUpdateSchema>;
