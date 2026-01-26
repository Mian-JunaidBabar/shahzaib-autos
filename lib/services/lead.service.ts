import { LeadStatus, LeadSource, Prisma } from "@prisma/client";
/**
 * Lead Service
 *
 * Business logic for lead management:
 * - Contact form submissions
 * - Lead tracking and qualification
 */
import { prisma } from "@/lib/prisma";


// Types
export type Lead = Prisma.LeadGetPayload<{}>;

export type CreateLeadInput = {
  name: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  subject?: string;
  message?: string;
};

export type UpdateLeadInput = {
  status?: LeadStatus;
  notes?: string;
};

export type LeadFilters = {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  dateFrom?: Date;
  dateTo?: Date;
};

/**
 * Get paginated list of leads
 */
export async function getLeads(
  filters: LeadFilters = {},
  pagination: { page?: number; limit?: number } = {},
) {
  const { search, status, source, dateFrom, dateTo } = filters;
  const { page = 1, limit = 20 } = pagination;

  const where: Prisma.LeadWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { subject: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (source) {
    where.source = source;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single lead by ID
 */
export async function getLead(id: string): Promise<Lead | null> {
  return prisma.lead.findUnique({
    where: { id },
  });
}

/**
 * Create a new lead
 */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
  return prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      source: input.source || LeadSource.CONTACT_FORM,
      subject: input.subject,
      message: input.message,
    },
  });
}

/**
 * Update a lead
 */
export async function updateLead(
  id: string,
  input: UpdateLeadInput,
): Promise<Lead> {
  return prisma.lead.update({
    where: { id },
    data: input,
  });
}

/**
 * Update lead status (with optional notes)
 */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string,
): Promise<Lead> {
  return updateLead(id, { status, ...(notes !== undefined && { notes }) });
}

/**
 * Delete a lead (hard delete - leads are transient)
 */
export async function deleteLead(id: string): Promise<void> {
  await prisma.lead.delete({ where: { id } });
}

/**
 * Get lead statistics
 */
export async function getLeadStats() {
  const [total, byStatus, bySource] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.lead.groupBy({
      by: ["source"],
      _count: true,
    }),
  ]);

  return {
    total,
    byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
    bySource: Object.fromEntries(bySource.map((s) => [s.source, s._count])),
    newLeads: byStatus.find((s) => s.status === LeadStatus.NEW)?._count || 0,
  };
}

/**
 * Get recent leads
 */
export async function getRecentLeads(limit = 5): Promise<Lead[]> {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
