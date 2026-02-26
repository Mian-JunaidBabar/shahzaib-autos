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
            error: error instanceof Error ? error.message : "Failed to fetch team members",
        };
    }
}

/**
 * Invite a new team member
 */
export async function inviteTeamMemberAction(input: {
    email: string;
    fullName: string;
    role: string;
}): Promise<ActionResult<TeamService.TeamMember>> {
    try {
        await requireAdmin();
        const member = await TeamService.inviteTeamMember(input);
        revalidatePath("/admin/dashboard/team");
        return { success: true, data: member };
    } catch (error) {
        console.error("inviteTeamMemberAction error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to invite team member",
        };
    }
}

/**
 * Update a team member's profile
 */
export async function updateTeamMemberAction(
    adminId: string,
    input: { role?: string; status?: string; fullName?: string; phone?: string }
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
            error: error instanceof Error ? error.message : "Failed to update team member",
        };
    }
}

/**
 * Remove a team member
 */
export async function removeTeamMemberAction(
    adminId: string
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
            error: error instanceof Error ? error.message : "Failed to remove team member",
        };
    }
}
