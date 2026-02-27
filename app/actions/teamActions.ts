/**
 * Team Server Actions
 *
 * RBAC-protected actions for team management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as TeamService from "@/lib/services/team.service";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all team members
 */
export async function getTeamMembersAction(): Promise<
  ActionResult<TeamService.TeamMember[]>
> {
  try {
    await requireAdmin();
    const members = await TeamService.getTeamMembers();
    return { success: true, data: members };
  } catch (error) {
    console.error("getTeamMembersAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch team members",
    };
  }
}

/**
 * Invite a new team member
 * Returns member + temporary password for admin to share manually
 */
export async function inviteTeamMemberAction(input: {
  email: string;
  fullName: string;
  password?: string;
}): Promise<ActionResult<TeamService.InviteResult>> {
  try {
    await requireAdmin();
    const result = await TeamService.inviteTeamMember(input);
    revalidatePath("/admin/dashboard/team");
    return { success: true, data: result };
  } catch (error) {
    console.error("inviteTeamMemberAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to invite team member",
    };
  }
}

/**
 * Update a team member's profile
 */
export async function updateTeamMemberAction(
  adminId: string,
  input: { role?: string; status?: string; fullName?: string; phone?: string },
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await TeamService.updateTeamMember(adminId, input);
    revalidatePath("/admin/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("updateTeamMemberAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update team member",
    };
  }
}

/**
 * Remove a team member
 */
export async function removeTeamMemberAction(
  adminId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await TeamService.removeTeamMember(adminId);
    revalidatePath("/admin/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("removeTeamMemberAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove team member",
    };
  }
}

/**
 * Confirm admin is now active (called after password is set)
 * This does NOT require admin auth - invited user confirms their own account
 */
export async function confirmAdminActiveAction(
  supabaseUserId: string,
): Promise<ActionResult> {
  try {
    await TeamService.confirmAdminActive(supabaseUserId);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("confirmAdminActiveAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to activate admin account",
    };
  }
}

/**
 * Get stored credentials for a pending team member
 * Only works for INVITED members
 */
export async function getCredentialsAction(
  adminId: string,
): Promise<
  ActionResult<{ fullName: string; email: string; password: string }>
> {
  try {
    await requireAdmin();
    const credentials = await TeamService.getCredentials(adminId);
    if (!credentials) {
      return {
        success: false,
        error: "No credentials available (member may have already logged in)",
      };
    }
    return { success: true, data: credentials };
  } catch (error) {
    console.error("getCredentialsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get credentials",
    };
  }
}
