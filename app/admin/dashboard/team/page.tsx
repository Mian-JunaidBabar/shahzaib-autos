"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  MoreVertical,
  Trash2,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
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
  inviteTeamMemberAction,
  updateTeamMemberAction,
  removeTeamMemberAction,
  getCredentialsAction,
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

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "INVITED":
      return "bg-yellow-100 text-yellow-700";
    case "INACTIVE":
      return "bg-red-100 text-red-700";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<{
    fullName: string;
    email: string;
    password: string;
  } | null>(null);
  const [credentialsCopied, setCredentialsCopied] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isPending, startTransition] = useTransition();

  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    startTransition(() => {
      fetchMembers();
    });
  }, []);

  const handleAddMember = async () => {
    if (!newEmail || !newName) {
      toast.error("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      const result = await inviteTeamMemberAction({
        email: newEmail,
        fullName: newName,
        password: newPassword || undefined,
      });

      if (result.success && result.data) {
        const { member, credentials: creds } = result.data;
        setMembers((prev) => [member as TeamMember, ...prev]);
        setShowAddModal(false);
        setNewEmail("");
        setNewName("");
        setNewPassword("");

        // Show the credentials modal
        setCredentials(creds);
        setCredentialsCopied(false);
        setShowCredentialsModal(true);
      } else {
        toast.error(result.error || "Failed to invite team member");
      }
    });
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    const special = "!@#$%";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Add 2 special characters
    password += special.charAt(Math.floor(Math.random() * special.length));
    password += special.charAt(Math.floor(Math.random() * special.length));
    // Shuffle
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    setNewPassword(password);
  };

  const handleToggleStatus = async (adminId: string, currentStatus: string) => {
    const newStatus =
      currentStatus?.toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    startTransition(async () => {
      const result = await updateTeamMemberAction(adminId, {
        status: newStatus,
      });
      if (result.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === adminId ? { ...m, status: newStatus } : m)),
        );
        toast.success(
          `Member ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`,
        );
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const handleRemoveMember = (member: TeamMember) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToDelete) return;

    startTransition(async () => {
      const result = await removeTeamMemberAction(memberToDelete.id);
      if (result.success) {
        setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
        toast.success("Team member removed");
        setShowDeleteModal(false);
        setMemberToDelete(null);
      } else {
        toast.error(result.error || "Failed to remove team member");
      }
    });
  };

  const handleCopyCredentials = async (member: TeamMember) => {
    startTransition(async () => {
      const result = await getCredentialsAction(member.id);
      if (result.success && result.data) {
        setCredentials(result.data);
        setCredentialsCopied(false);
        setShowCredentialsModal(true);
      } else {
        toast.error(result.error || "Credentials no longer available");
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
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INVITED">Pending Invite</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
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
                        {member.status?.toUpperCase() === "INVITED"
                          ? "Pending Invite"
                          : member.status?.toUpperCase() === "ACTIVE"
                            ? "Active"
                            : member.status || "Unknown"}
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
                          {member.status?.toUpperCase() === "INVITED" ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleCopyCredentials(member)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Credentials
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMember(member)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Revoke Invite
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleStatus(member.id, member.status)
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                {member.status?.toUpperCase() === "ACTIVE"
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMember(member)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </>
                          )}
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
              Create an admin account. You&apos;ll get credentials to share
              privately.
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
            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter or generate password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to auto-generate a secure password
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={isPending}>
              {isPending ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Modal */}
      <Dialog
        open={showCredentialsModal}
        onOpenChange={setShowCredentialsModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              Account Created
            </DialogTitle>
            <DialogDescription className="pt-2">
              Copy and share these credentials via WhatsApp or other secure
              channel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap border">
              {`🔐 Shahzaib Autos Admin Login

Name: ${credentials?.fullName || "Team Member"}
Email: ${credentials?.email}
Password: ${credentials?.password}

🔗 Login: ${typeof window !== "undefined" ? window.location.origin : ""}/admin/auth/login

⚠️ Please change your password after first login.`}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                const text = `🔐 Shahzaib Autos Admin Login

Name: ${credentials?.fullName || "Team Member"}
Email: ${credentials?.email}
Password: ${credentials?.password}

🔗 Login: ${window.location.origin}/admin/auth/login

⚠️ Please change your password after first login.`;
                navigator.clipboard.writeText(text);
                setCredentialsCopied(true);
                toast.success("Message copied to clipboard!");
                setTimeout(() => setCredentialsCopied(false), 2000);
              }}
            >
              {credentialsCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Message
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Credentials are stored until they log in for the first time.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCredentialsModal(false);
                setCredentials(null);
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              {memberToDelete?.status?.toUpperCase() === "INVITED"
                ? "Revoke Invite"
                : "Remove Team Member"}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {memberToDelete?.status?.toUpperCase() === "INVITED" ? (
                <>
                  Are you sure you want to revoke the invite for{" "}
                  <span className="font-semibold">
                    {memberToDelete?.fullName || memberToDelete?.email}
                  </span>
                  ? They will not be able to join the team.
                </>
              ) : (
                <>
                  Are you sure you want to remove{" "}
                  <span className="font-semibold">
                    {memberToDelete?.fullName || memberToDelete?.email}
                  </span>{" "}
                  from the admin team? They will lose all admin access
                  immediately.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setMemberToDelete(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveMember}
              disabled={isPending}
            >
              {isPending
                ? "Removing..."
                : memberToDelete?.status?.toUpperCase() === "INVITED"
                  ? "Revoke Invite"
                  : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
