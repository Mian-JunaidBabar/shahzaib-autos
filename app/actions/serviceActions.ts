/**
 * Service Server Actions
 *
 * RBAC-protected actions for service management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as ServiceService from "@/lib/services/service.service";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceFilterSchema,
  ServiceCreateInput,
  ServiceUpdateInput,
  ServiceFilterInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get services with filters and pagination
 */
export async function getServicesAction(
  input: ServiceFilterInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof ServiceService.getServices>>>
> {
  try {
    await requireAdmin();

    const validated = serviceFilterSchema.parse(input);
    const result = await ServiceService.getServices(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error("getServicesAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch services",
    };
  }
}

/**
 * Get single service by ID
 */
export async function getServiceAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof ServiceService.getService>>>
> {
  try {
    await requireAdmin();

    const service = await ServiceService.getService(id);
    if (!service) {
      return { success: false, error: "Service not found" };
    }

    return { success: true, data: service };
  } catch (error) {
    console.error("getServiceAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch service",
    };
  }
}

/**
 * Create new service
 */
export async function createServiceAction(
  input: ServiceCreateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = serviceCreateSchema.parse(input);
    const service = await ServiceService.createService(validated);

    revalidatePath("/admin/dashboard/services");
    revalidatePath("/services");

    return { success: true, data: { id: service.id } };
  } catch (error) {
    console.error("createServiceAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create service",
    };
  }
}

/**
 * Update existing service
 */
export async function updateServiceAction(
  input: ServiceUpdateInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = serviceUpdateSchema.parse(input);
    const service = await ServiceService.updateService(validated.id, validated);

    revalidatePath("/admin/dashboard/services");
    revalidatePath("/services");

    return { success: true, data: { id: service.id } };
  } catch (error) {
    console.error("updateServiceAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update service",
    };
  }
}

/**
 * Delete service (includes Cloudinary cleanup)
 */
export async function deleteServiceAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const result = await ServiceService.deleteService(id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/admin/dashboard/services");
    revalidatePath("/services");

    return { success: true };
  } catch (error) {
    console.error("deleteServiceAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete service",
    };
  }
}

/**
 * Toggle service active status
 */
export async function toggleServiceActiveAction(
  id: string,
): Promise<ActionResult<{ isActive: boolean }>> {
  try {
    await requireAdmin();

    const service = await ServiceService.toggleServiceActive(id);

    revalidatePath("/admin/dashboard/services");
    revalidatePath("/services");

    return { success: true, data: { isActive: service.isActive } };
  } catch (error) {
    console.error("toggleServiceActiveAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle service status",
    };
  }
}

/**
 * Get service statistics
 */
export async function getServiceStatsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof ServiceService.getServiceStats>>>
> {
  try {
    await requireAdmin();

    const stats = await ServiceService.getServiceStats();

    return { success: true, data: stats };
  } catch (error) {
    console.error("getServiceStatsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch service stats",
    };
  }
}
