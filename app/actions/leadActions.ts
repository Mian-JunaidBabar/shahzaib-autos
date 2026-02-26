/**
 * Lead Server Actions
 *
 * RBAC-protected actions for lead management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as LeadService from "@/lib/services/lead.service";
import * as NotificationService from "@/lib/services/notification.service";
import {
  leadCreateSchema,
  leadUpdateSchema,
  leadFilterSchema,
  LeadCreateInput,
  LeadUpdateInput,
  LeadFilterInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get leads with filters and pagination
 */
export async function getLeadsAction(
  input: LeadFilterInput,
): Promise<ActionResult<Awaited<ReturnType<typeof LeadService.getLeads>>>> {
  try {
    await requireAdmin();

    const validated = leadFilterSchema.parse(input);
    const result = await LeadService.getLeads(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error("getLeadsAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch leads",
    };
  }
}

/**
 * Get single lead by ID
 */
export async function getLeadAction(
  id: string,
): Promise<ActionResult<Awaited<ReturnType<typeof LeadService.getLead>>>> {
  try {
    await requireAdmin();

    const lead = await LeadService.getLead(id);
    if (!lead) {
      return { success: false, error: "Lead not found" };
    }

    return { success: true, data: lead };
  } catch (error) {
    console.error("getLeadAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch lead",
    };
  }
}

/**
 * Create new lead (also works without auth for contact form)
 */
export async function createLeadAction(
  input: LeadCreateInput,
): Promise<ActionResult<{ id: string; whatsappUrl?: string }>> {
  try {
    const validated = leadCreateSchema.parse(input);
    const lead = await LeadService.createLead(validated);

    // Generate WhatsApp notification for admin
    const notification = NotificationService.sendLeadNotification(
      lead,
      "internal",
    );

    // Send Email Alert
    await NotificationService.EmailNotification.sendNewLeadAlert(lead.id, lead.email || "No Email Provided");

    revalidatePath("/admin/dashboard/leads");

    return {
      success: true,
      data: { id: lead.id, whatsappUrl: notification.url },
    };
  } catch (error) {
    console.error("createLeadAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lead",
    };
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatusAction(
  input: LeadUpdateInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const validated = leadUpdateSchema.parse(input);
    await LeadService.updateLeadStatus(
      validated.id,
      validated.status,
      validated.notes,
    );

    revalidatePath("/admin/dashboard/leads");
    revalidatePath(`/admin/dashboard/leads/${validated.id}`);

    return { success: true };
  } catch (error) {
    console.error("updateLeadStatusAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lead",
    };
  }
}

/**
 * Delete lead
 */
export async function deleteLeadAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await LeadService.deleteLead(id);

    revalidatePath("/admin/dashboard/leads");

    return { success: true };
  } catch (error) {
    console.error("deleteLeadAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lead",
    };
  }
}

/**
 * Get lead statistics
 */
export async function getLeadStatsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof LeadService.getLeadStats>>>
> {
  try {
    await requireAdmin();

    const stats = await LeadService.getLeadStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("getLeadStatsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch lead stats",
    };
  }
}

/**
 * Get recent leads
 */
export async function getRecentLeadsAction(
  limit: number = 5,
): Promise<
  ActionResult<Awaited<ReturnType<typeof LeadService.getRecentLeads>>>
> {
  try {
    await requireAdmin();

    const leads = await LeadService.getRecentLeads(limit);
    return { success: true, data: leads };
  } catch (error) {
    console.error("getRecentLeadsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch recent leads",
    };
  }
}

/**
 * Send acknowledgment to lead
 */
export async function sendLeadAcknowledgmentAction(
  id: string,
): Promise<ActionResult<{ whatsappUrl: string }>> {
  try {
    await requireAdmin();

    const lead = await LeadService.getLead(id);
    if (!lead) {
      return { success: false, error: "Lead not found" };
    }

    const notification = NotificationService.sendLeadNotification(
      lead,
      "customer_ack",
    );

    return { success: true, data: { whatsappUrl: notification.url! } };
  } catch (error) {
    console.error("sendLeadAcknowledgmentAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate acknowledgment",
    };
  }
}
