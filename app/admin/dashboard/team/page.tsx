"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getTeamMembersAction,
  addTeamMemberAction,
  updateTeamMemberAction,
  removeTeamMemberAction,
} from "@/app/actions/teamActions";
import { toast } from "sonner";

type TeamMember = {
  id: string;
  supabaseUserId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: Date;
  lastSignIn: string | null;
};

const ROLES = ["Admin", "Manager", "Editor", "Viewer"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-red-100 text-red-700";
    case "on-leave":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-700";
    case "Manager":
      return "bg-blue-100 text-blue-700";
    case "Editor":
      return "bg-cyan-100 text-cyan-700";
    case "Viewer":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

function formatRelativeTime(dateStr: string | null) {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getTeamMembersAction();
    if (result.success && result.data) {
      setMembers(result.data as TeamMember[]);
    } else {
      if (
        result.error?.includes("UNAUTHORIZED") ||
        result.error?.includes("FORBIDDEN")
      ) {
        window.location.href = "/admin/auth/unauthorized";
        return;
      }
      toast.error(result.error || "Failed to load team members");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    if (!newEmail || !newName) {
      toast.error("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      const result = await addTeamMemberAction({
        email: newEmail,
        fullName: newName,
      });

      if (result.success && result.data) {
        setMembers((prev) => [result.data as TeamMember, ...prev]);
        setShowAddModal(false);
        setNewEmail("");
        setNewName("");
        toast.success(
          "Team member added successfully! An invite email has been sent.",
        );
      } else {
        toast.error(result.error || "Failed to add team member");
      }
    });
  };

  const handleUpdateRole = async (adminId: string, newRoleValue: string) => {
    startTransition(async () => {
      const result = await updateTeamMemberAction(adminId, {
        role: newRoleValue,
      });
      if (result.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === adminId ? { ...m, role: newRoleValue } : m,
          ),
        );
        toast.success("Role updated");
      } else {
        toast.error(result.error || "Failed to update role");
      }
    });
  };

  const handleToggleStatus = async (adminId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    startTransition(async () => {
      const result = await updateTeamMemberAction(adminId, {
        status: newStatus,
      });
      if (result.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === adminId ? { ...m, status: newStatus } : m)),
        );
        toast.success(
          `Member ${newStatus === "active" ? "activated" : "deactivated"}`,
        );
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const handleRemoveMember = async (adminId: string) => {
    if (!confirm("Remove this team member? They will lose admin access."))
      return;
    startTransition(async () => {
      const result = await removeTeamMemberAction(adminId);
      if (result.success) {
        setMembers((prev) => prev.filter((m) => m.id !== adminId));
        toast.success("Team member removed");
      } else {
        toast.error(result.error || "Failed to remove team member");
      }
    });
  };

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      (m.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    inactive: members.filter((m) => m.status === "inactive").length,
    onLeave: members.filter((m) => m.status === "on-leave").length,
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff members, roles, and access
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Team Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.inactive}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.onLeave}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Table */}
      <Card>
        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No team members found</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first team member to get started"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {(member.fullName || member.email)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.fullName || "Unnamed"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getRoleColor(member.role)}
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(member.status)}
                      >
                        {member.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(member.lastSignIn)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(member.id, member.status)
                            }
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {member.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member. They&apos;ll receive an email to set up their
              account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isPending}>
              {isPending ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
