/**
 * Category Server Actions
 *
 * RBAC-protected actions for category management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/services/auth.service";
import * as CategoryService from "@/lib/services/category.service";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  suggestedSlug?: string;
};

type IssueField = "name" | "slug" | "root";

type ActionIssue = {
  path: [IssueField];
  message: string;
};

function issuesError(issues: ActionIssue[]): string {
  return JSON.stringify(issues);
}

function getUniqueFieldFromTarget(
  target: Prisma.PrismaClientKnownRequestError["meta"],
): IssueField {
  const rawTarget = target?.target;
  const targets = Array.isArray(rawTarget)
    ? rawTarget.map(String)
    : typeof rawTarget === "string"
      ? [rawTarget]
      : [];

  if (targets.some((item) => item.includes("slug"))) return "slug";
  if (targets.some((item) => item.includes("name"))) return "name";
  return "root";
}

/**
 * Get all categories (admin)
 */
export async function getCategoriesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof CategoryService.getCategories>>>
> {
  try {
    const categories = await CategoryService.getCategories();
    return { success: true, data: categories };
  } catch (error) {
    console.error("getCategoriesAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

/**
 * Get active categories only (public)
 */
export async function getActiveCategoriesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof CategoryService.getActiveCategories>>>
> {
  try {
    const categories = await CategoryService.getActiveCategories();
    return { success: true, data: categories };
  } catch (error) {
    console.error("getActiveCategoriesAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch active categories",
    };
  }
}

/**
 * Get single category by ID
 */
export async function getCategoryAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof CategoryService.getCategory>>>
> {
  try {
    const category = await CategoryService.getCategory(id);
    if (!category) {
      return { success: false, error: "Category not found" };
    }
    return { success: true, data: category };
  } catch (error) {
    console.error("getCategoryAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch category",
    };
  }
}

/**
 * Create category
 */
export async function createCategoryAction(
  input: CategoryCreateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = categoryCreateSchema.parse(input);
    const category = await CategoryService.createCategory(validated);

    revalidatePath("/admin/dashboard/categories");
    revalidateTag(
      "categories:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );
    revalidateTag(
      "products:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );

    return { success: true, data: { id: category.id } };
  } catch (error) {
    console.error("createCategoryAction error:", error);

    if (error instanceof ZodError) {
      return { success: false, error: JSON.stringify(error.issues) };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const field = getUniqueFieldFromTarget(error.meta);
      const nextSuggestedSlug =
        field === "slug"
          ? await CategoryService.getAvailableCategorySlug(input.slug)
          : undefined;

      const issues: ActionIssue[] = [
        {
          path: [field],
          message:
            field === "slug"
              ? `This slug already exists.${nextSuggestedSlug ? ` Try "${nextSuggestedSlug}".` : ""}`
              : field === "name"
                ? "This name already exists. Please choose a unique one."
                : "A unique field already exists. Please use a different value.",
        },
      ];

      return {
        success: false,
        error: issuesError(issues),
        suggestedSlug: nextSuggestedSlug,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while saving.",
    };
  }
}

/**
 * Update category
 */
export async function updateCategoryAction(
  id: string,
  input: Partial<CategoryCreateInput>,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = categoryUpdateSchema.parse({ ...input, id });

    await CategoryService.updateCategory(id, validated as CategoryUpdateInput);

    revalidatePath("/admin/dashboard/categories");
    revalidateTag(
      "categories:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );
    revalidateTag(
      "products:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updateCategoryAction error:", error);

    if (error instanceof ZodError) {
      return { success: false, error: JSON.stringify(error.issues) };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const field = getUniqueFieldFromTarget(error.meta);
      const nextSuggestedSlug =
        field === "slug" && input.slug
          ? await CategoryService.getAvailableCategorySlug(input.slug, id)
          : undefined;

      const issues: ActionIssue[] = [
        {
          path: [field],
          message:
            field === "slug"
              ? `This slug already exists.${nextSuggestedSlug ? ` Try "${nextSuggestedSlug}".` : ""}`
              : field === "name"
                ? "This name already exists. Please choose a unique one."
                : "A unique field already exists. Please use a different value.",
        },
      ];

      return {
        success: false,
        error: issuesError(issues),
        suggestedSlug: nextSuggestedSlug,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while saving.",
    };
  }
}

/**
 * Delete category
 */
export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await CategoryService.deleteCategory(id);

    revalidatePath("/admin/dashboard/categories");
    revalidateTag(
      "categories:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );
    revalidateTag(
      "products:all",
      undefined /* eslint-disable-line @typescript-eslint/no-explicit-any */ as any,
    );

    return { success: true };
  } catch (error) {
    console.error("deleteCategoryAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
