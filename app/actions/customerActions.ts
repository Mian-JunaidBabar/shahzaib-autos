/**
 * Customer Server Actions
 *
 * RBAC-protected actions for customer management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as CustomerService from "@/lib/services/customer.service";
import {
  customerCreateSchema,
  customerUpdateSchema,
  customerFilterSchema,
  CustomerCreateInput,
  CustomerUpdateInput,
  CustomerFilterInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get customers with filters and pagination
 */
export async function getCustomersAction(
  input: CustomerFilterInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof CustomerService.getCustomers>>>
> {
  try {
    await requireAdmin();

    const validated = customerFilterSchema.parse(input);
    const result = await CustomerService.getCustomers(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error("getCustomersAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch customers",
    };
  }
}

/**
 * Get single customer by ID with history
 */
export async function getCustomerAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof CustomerService.getCustomer>>>
> {
  try {
    await requireAdmin();

    const customer = await CustomerService.getCustomer(id);
    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    return { success: true, data: customer };
  } catch (error) {
    console.error("getCustomerAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch customer",
    };
  }
}

/**
 * Create new customer
 */
export async function createCustomerAction(
  input: CustomerCreateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = customerCreateSchema.parse(input);
    const customer = await CustomerService.createCustomer(validated);

    revalidatePath("/admin/dashboard/customers");

    return { success: true, data: { id: customer.id } };
  } catch (error) {
    console.error("createCustomerAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create customer",
    };
  }
}

/**
 * Update customer
 */
export async function updateCustomerAction(
  input: CustomerUpdateInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const validated = customerUpdateSchema.parse(input);
    const { id, ...data } = validated;
    await CustomerService.updateCustomer(id, data);

    revalidatePath("/admin/dashboard/customers");
    revalidatePath(`/admin/dashboard/customers/${id}`);

    return { success: true };
  } catch (error) {
    console.error("updateCustomerAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update customer",
    };
  }
}

/**
 * Toggle customer VIP status
 */
export async function toggleVipStatusAction(
  id: string,
): Promise<ActionResult<{ isVip: boolean }>> {
  try {
    await requireAdmin();

    const customer = await CustomerService.toggleVipStatus(id);

    revalidatePath("/admin/dashboard/customers");
    revalidatePath(`/admin/dashboard/customers/${id}`);

    return { success: true, data: { isVip: customer.isVip } };
  } catch (error) {
    console.error("toggleVipStatusAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to toggle VIP status",
    };
  }
}

/**
 * Delete customer
 */
export async function deleteCustomerAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await CustomerService.deleteCustomer(id);

    revalidatePath("/admin/dashboard/customers");

    return { success: true };
  } catch (error) {
    console.error("deleteCustomerAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete customer",
    };
  }
}

/**
 * Get customer statistics
 */
export async function getCustomerStatsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof CustomerService.getCustomerStats>>>
> {
  try {
    await requireAdmin();

    const stats = await CustomerService.getCustomerStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("getCustomerStatsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch customer stats",
    };
  }
}

/**
 * Get customer history (orders + bookings)
 */
export async function getCustomerHistoryAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof CustomerService.getCustomerHistory>>>
> {
  try {
    await requireAdmin();

    const history = await CustomerService.getCustomerHistory(id);
    return { success: true, data: history };
  } catch (error) {
    console.error("getCustomerHistoryAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch customer history",
    };
  }
}
