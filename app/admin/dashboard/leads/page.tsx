"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Share2,
  PhoneCall,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getLeadsAction,
  updateLeadStatusAction,
} from "@/app/actions/leadActions";
import type { LeadStatus, LeadSource } from "@prisma/client";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: LeadSource;
  subject: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const statusOptions: { value: LeadStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const sourceOptions: { value: LeadSource | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Sources" },
  { value: "CONTACT_FORM", label: "Contact Form" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Phone" },
  { value: "REFERRAL", label: "Referral" },
  { value: "OTHER", label: "Other" },
];

const getStatusColor = (status: LeadStatus) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-700";
    case "CONTACTED":
      return "bg-orange-100 text-orange-700";
    case "QUALIFIED":
      return "bg-purple-100 text-purple-700";
    case "CONVERTED":
      return "bg-green-100 text-green-700";
    case "LOST":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getSourceIcon = (source: LeadSource) => {
  switch (source) {
    case "CONTACT_FORM":
      return Globe;
    case "WHATSAPP":
      return MessageCircle;
    case "PHONE":
      return PhoneCall;
    case "REFERRAL":
      return Share2;
    case "OTHER":
      return MoreHorizontal;
    default:
      return Globe;
  }
};

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [stats, setStats] = useState({
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getLeadsAction({
      status: statusFilter === "ALL" ? undefined : statusFilter,
      source: sourceFilter === "ALL" ? undefined : sourceFilter,
      search: searchQuery || undefined,
      page,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    if (result.success && result.data) {
      setLeads(result.data.leads as Lead[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);

      // Calculate stats
      const counts = result.data.leads.reduce(
        (acc, l) => {
          if (l.status === "NEW") acc.new++;
          else if (l.status === "CONTACTED") acc.contacted++;
          else if (l.status === "QUALIFIED") acc.qualified++;
          else if (l.status === "CONVERTED") acc.converted++;
          else if (l.status === "LOST") acc.lost++;
          return acc;
        },
        { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 },
      );
      setStats(counts);
    } else {
      setError(result.error || "Failed to fetch leads");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sourceFilter, page]);

  const handleSearch = () => {
    setPage(1);
    fetchLeads();
  };

  const handleStatusUpdate = async (id: string, newStatus: LeadStatus) => {
    startTransition(async () => {
      const result = await updateLeadStatusAction({ id, status: newStatus });

      if (result.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
        );
        toast.success(`Lead status updated to ${newStatus}`);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const openWhatsApp = (lead: Lead) => {
    if (!lead.phone) {
      toast.error("No phone number available for this lead");
      return;
    }
    const message = encodeURIComponent(
      `Hello ${lead.name}! Thank you for contacting Shahzaib Autos. How can we help you today?`,
    );
    window.open(
      `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${message}`,
      "_blank",
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading && leads.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Track and manage customer inquiries
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/leads/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold">{stats.contacted}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold">{stats.qualified}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold">{stats.converted}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lost</p>
                <p className="text-2xl font-bold">{stats.lost}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-md"
          />
          <Button variant="secondary" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val as LeadStatus | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sourceFilter}
          onValueChange={(val) => {
            setSourceFilter(val as LeadSource | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {sourceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No leads found</p>
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => {
                  const SourceIcon = getSourceIcon(lead.source);
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{lead.name}</p>
                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
                          <SourceIcon className="h-3 w-3" />
                          {lead.source.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {lead.subject && (
                            <p className="font-medium truncate">
                              {lead.subject}
                            </p>
                          )}
                          {lead.message && (
                            <p className="text-sm text-muted-foreground truncate">
                              {lead.message}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(val) =>
                            handleStatusUpdate(lead.id, val as LeadStatus)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                            <SelectItem value="CONVERTED">Converted</SelectItem>
                            <SelectItem value="LOST">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {lead.phone && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openWhatsApp(lead)}
                              title="WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/dashboard/leads/${lead.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {leads.length} of {totalCount} leads
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
