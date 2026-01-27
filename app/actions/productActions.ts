/**
 * Product Server Actions
 *
 * RBAC-protected actions for product management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as ProductService from "@/lib/services/product.service";
import {
  productCreateSchema,
  productUpdateSchema,
  productFilterSchema,
  ProductCreateInput,
  ProductUpdateInput,
  ProductFilterInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get products with filters and pagination
 */
export async function getProductsAction(
  input: ProductFilterInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof ProductService.getProducts>>>
> {
  try {
    await requireAdmin();

    const validated = productFilterSchema.parse(input);
    const result = await ProductService.getProducts(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error("getProductsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

/**
 * Get single product by ID
 */
export async function getProductAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof ProductService.getProduct>>>
> {
  try {
    await requireAdmin();

    const product = await ProductService.getProduct(id);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("getProductAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

/**
 * Create new product
 */
export async function createProductAction(
  input: ProductCreateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = productCreateSchema.parse(input);
    const product = await ProductService.createProduct(validated);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/products");

    return { success: true, data: { id: product.id } };
  } catch (error) {
    console.error("createProductAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

/**
 * Update existing product
 */
export async function updateProductAction(
  input: ProductUpdateInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const validated = productUpdateSchema.parse(input);
    const { id, ...data } = validated;
    await ProductService.updateProduct(id, data);

    revalidatePath("/admin/dashboard/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("updateProductAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

/**
 * Toggle product active status
 */
export async function toggleProductActiveAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await ProductService.updateProduct(id, { isActive });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("toggleProductActiveAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle product status",
    };
  }
}

/**
 * Deactivate product (soft delete)
 */
export async function deactivateProductAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await ProductService.deactivateProduct(id);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("deactivateProductAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to deactivate product",
    };
  }
}

/**
 * Archive product (soft delete with isArchived flag)
 */
export async function archiveProductAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await ProductService.archiveProduct(id);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("archiveProductAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to archive product",
    };
  }
}

/**
 * Unarchive product
 */
export async function unarchiveProductAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await ProductService.unarchiveProduct(id);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("unarchiveProductAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to unarchive product",
    };
  }
}

/**
 * Permanently delete product (with referential integrity check)
 * Will fail if product has order history - returns reason to archive instead
 */
export async function deleteProductAction(
  id: string,
): Promise<ActionResult<ProductService.DeleteProductResult>> {
  try {
    await requireAdmin();

    const result = await ProductService.deleteProduct(id);

    if (result.deleted) {
      revalidatePath("/admin/dashboard/products");
      revalidatePath("/admin/dashboard/inventory");
      revalidatePath("/products");
    }

    return {
      success: result.success,
      data: result,
      error: result.reason,
    };
  } catch (error) {
    console.error("deleteProductAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

/**
 * Bulk archive products
 */
export async function bulkArchiveProductsAction(
  ids: string[],
): Promise<ActionResult<{ count: number }>> {
  try {
    await requireAdmin();

    const result = await ProductService.bulkArchiveProducts(ids);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");

    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error("bulkArchiveProductsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to archive products",
    };
  }
}

/**
 * Bulk delete products (only those without order history)
 */
export async function bulkDeleteProductsAction(ids: string[]): Promise<
  ActionResult<{
    deletedCount: number;
    blockedCount: number;
    blockedIds: string[];
  }>
> {
  try {
    await requireAdmin();

    const result = await ProductService.bulkDeleteProducts(ids);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");
    revalidatePath("/products");

    return {
      success: true,
      data: {
        deletedCount: result.deletedCount,
        blockedCount: result.blockedCount,
        blockedIds: result.blockedIds,
      },
    };
  } catch (error) {
    console.error("bulkDeleteProductsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete products",
    };
  }
}

/**
 * Update product stock
 */
export async function updateStockAction(
  productId: string,
  quantity: number,
  operation: "set" | "increment" | "decrement",
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await ProductService.updateStock(productId, quantity, operation);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");

    return { success: true };
  } catch (error) {
    console.error("updateStockAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
}

/**
 * Rebalance stock for multiple products
 */
export async function rebalanceStockAction(
  items: ProductService.StockRebalanceItem[],
): Promise<ActionResult<ProductService.StockRebalanceResult>> {
  try {
    await requireAdmin();

    const result = await ProductService.rebalanceStock(items);

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/admin/dashboard/inventory");

    return {
      success: result.success,
      data: result,
      error: result.errors.join(", ") || undefined,
    };
  } catch (error) {
    console.error("rebalanceStockAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to rebalance stock",
    };
  }
}

/**
 * Get products for rebalance view
 */
export async function getProductsForRebalanceAction(): Promise<
  ActionResult<
    Awaited<ReturnType<typeof ProductService.getProductsForRebalance>>
  >
> {
  try {
    await requireAdmin();

    const products = await ProductService.getProductsForRebalance();
    return { success: true, data: products };
  } catch (error) {
    console.error("getProductsForRebalanceAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch products for rebalance",
    };
  }
}

/**
 * Get product categories
 */
export async function getCategoriesAction(): Promise<ActionResult<string[]>> {
  try {
    await requireAdmin();

    const categories = await ProductService.getCategories();
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
 * Get low stock products
 */
export async function getLowStockProductsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof ProductService.getLowStockProducts>>>
> {
  try {
    await requireAdmin();

    const products = await ProductService.getLowStockProducts();
    return { success: true, data: products };
  } catch (error) {
    console.error("getLowStockProductsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch low stock products",
    };
  }
}
