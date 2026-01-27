/**
 * Data Transfer Objects (DTOs) and Interfaces
 *
 * Centralized type definitions for all data structures:
 * - API response types
 * - Service layer types
 * - Action result types
 * - Entity DTOs for frontend consumption
 *
 * NOTE: Authentication is handled EXCLUSIVELY by Supabase Auth.
 * User/Role types are defined locally, not from Prisma.
 */
import type {
  Product,
  ProductImage,
  Inventory,
  Order,
  OrderItem,
  Booking,
  Lead,
  Customer,
  OrderStatus,
  BookingStatus,
  LeadStatus,
  LeadSource,
  Admin,
} from "@prisma/client";

// ============================================
// COMMON TYPES
// ============================================

/**
 * Standard API response wrapper
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// USER / AUTH DTOs
// ============================================

/**
 * User DTO - represents Supabase Auth user data
 * NOT stored in Prisma - comes from Supabase Auth
 */
export interface UserDTO {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  image?: string | null;
  createdAt?: string;
}

/**
 * Admin record from Prisma - maps Supabase user to admin access
 */
export interface AdminDTO {
  id: string;
  supabaseUserId: string;
  createdAt: string;
}

export interface SessionDTO {
  user: UserDTO;
  expiresAt: string;
}

// ============================================
// PRODUCT DTOs
// ============================================

/**
 * Product status enum (mirrors Prisma)
 */
export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "DRAFT" | "ARCHIVED";

/**
 * Product with relations for display
 */
export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  category?: string | null;
  badgeId?: string | null;
  badge?: {
    id: string;
    name: string;
    color: string;
    isActive: boolean;
  } | null;
  status: ProductStatus;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImageDTO[];
  inventory?: InventoryDTO | null;
}

/**
 * Product image for display
 */
export interface ProductImageDTO {
  id: string;
  secureUrl: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  uploadedAt: string;
}

/**
 * Inventory information
 */
export interface InventoryDTO {
  id: string;
  quantity: number;
  lowStockAt: number;
  reorderPoint: number;
  updatedAt: string;
}

/**
 * Product creation input (from form/API)
 */
export interface CreateProductInput {
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  category?: string | null;
  badgeId?: string | null;
  isActive?: boolean;
  stock?: number;
  lowStockThreshold?: number;
}

/**
 * Product update input
 */
export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
  isArchived?: boolean;
  keepImagePublicIds?: string[];
}

/**
 * Stock rebalance item
 */
export interface StockRebalanceItem {
  id: string;
  newStock: number;
}

/**
 * Stock rebalance result
 */
export interface StockRebalanceResult {
  success: boolean;
  updatedCount: number;
  errors: string[];
}

/**
 * Delete product result
 */
export interface DeleteProductResult {
  success: boolean;
  deleted?: boolean;
  reason?: string;
  orderCount?: number;
}

/**
 * Lightweight product for rebalance view
 */
export interface ProductRebalanceDTO {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  inventory: {
    quantity: number;
    lowStockAt: number;
  } | null;
}

/**
 * Product update input
 */
export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

/**
 * Product filter/query parameters
 */
export interface ProductFilterInput {
  search?: string;
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ============================================
// PRODUCT IMAGE DTOs
// ============================================

/**
 * Image upload result from Cloudinary
 */
export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Create product image input
 */
export interface CreateProductImageInput {
  productId: string;
  secureUrl: string;
  publicId: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

/**
 * Saved image response
 */
export interface SavedImageDTO {
  id: string;
  productId: string;
  secureUrl: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  uploadedAt: string;
}

// ============================================
// ORDER DTOs
// ============================================

/**
 * Order with relations for display
 */
export interface OrderDTO {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  address?: string | null;
  subtotal: number;
  total: number;
  status: OrderStatus;
  notes?: string | null;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDTO[];
  customer?: CustomerDTO | null;
}

/**
 * Order item for display
 */
export interface OrderItemDTO {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Order creation input
 */
export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  items: CreateOrderItemInput[];
  subtotal: number;
  total: number;
  notes?: string;
}

/**
 * Order item creation input
 */
export interface CreateOrderItemInput {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Order update input
 */
export interface UpdateOrderInput {
  id: string;
  status?: OrderStatus;
  notes?: string;
}

/**
 * Order filter parameters
 */
export interface OrderFilterInput {
  search?: string;
  status?: OrderStatus;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "total" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ============================================
// BOOKING DTOs
// ============================================

/**
 * Booking with relations for display
 */
export interface BookingDTO {
  id: string;
  bookingNumber: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  serviceType: string;
  vehicleInfo?: string | null;
  date: string;
  timeSlot?: string | null;
  address: string;
  notes?: string | null;
  status: BookingStatus;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerDTO | null;
}

/**
 * Booking creation input
 */
export interface CreateBookingInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: string;
  vehicleInfo?: string;
  date: Date | string;
  timeSlot?: string;
  address: string;
  notes?: string;
}

/**
 * Booking update input
 */
export interface UpdateBookingInput {
  id: string;
  status?: BookingStatus;
  date?: Date | string;
  timeSlot?: string;
  address?: string;
  notes?: string;
}

/**
 * Booking filter parameters
 */
export interface BookingFilterInput {
  search?: string;
  status?: BookingStatus;
  customerId?: string;
  serviceType?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "date" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ============================================
// LEAD DTOs
// ============================================

/**
 * Lead for display
 */
export interface LeadDTO {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  source: LeadSource;
  subject?: string | null;
  message?: string | null;
  status: LeadStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lead creation input
 */
export interface CreateLeadInput {
  name: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  subject?: string;
  message?: string;
}

/**
 * Lead update input
 */
export interface UpdateLeadInput {
  id: string;
  status?: LeadStatus;
  notes?: string;
}

/**
 * Lead filter parameters
 */
export interface LeadFilterInput {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "status" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ============================================
// CUSTOMER DTOs
// ============================================

/**
 * Customer for display
 */
export interface CustomerDTO {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  notes?: string | null;
  isVip: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer with history
 */
export interface CustomerWithHistoryDTO extends CustomerDTO {
  orders: OrderDTO[];
  bookings: BookingDTO[];
  totalOrders: number;
  totalBookings: number;
  totalSpent: number;
}

/**
 * Customer creation input
 */
export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
  isVip?: boolean;
}

/**
 * Customer update input
 */
export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  id: string;
}

/**
 * Customer filter parameters
 */
export interface CustomerFilterInput {
  search?: string;
  isVip?: boolean;
  sortBy?: "name" | "createdAt" | "totalOrders";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ============================================
// DASHBOARD DTOs
// ============================================

/**
 * Dashboard statistics
 */
export interface DashboardStatsDTO {
  totalRevenue: number;
  totalOrders: number;
  totalBookings: number;
  totalCustomers: number;
  newOrders: number;
  pendingBookings: number;
  newLeads: number;
  lowStockProducts: number;
}

/**
 * Order statistics
 */
export interface OrderStatsDTO {
  total: number;
  newOrders: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

/**
 * Booking statistics
 */
export interface BookingStatsDTO {
  total: number;
  pending: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
  upcomingBookings: number;
}

/**
 * Lead statistics
 */
export interface LeadStatsDTO {
  total: number;
  newLeads: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  conversionRate: number;
}

/**
 * Low stock product alert
 */
export interface LowStockProductDTO {
  id: string;
  name: string;
  slug: string;
  stock: number;
  lowStockAt: number;
  primaryImage?: string | null;
}

// ============================================
// NOTIFICATION DTOs
// ============================================

/**
 * WhatsApp message result
 */
export interface WhatsAppMessageDTO {
  url: string;
  phone: string;
  message: string;
}

/**
 * Low stock alert input
 */
export interface LowStockAlertInput {
  name: string;
  stock: number;
  sku?: string | null;
}

// ============================================
// TYPE GUARDS
// ============================================

export function isActionSuccess<T>(
  result: ActionResult<T>,
): result is ActionResult<T> & { data: T } {
  return result.success && result.data !== undefined;
}

export function isActionError<T>(
  result: ActionResult<T>,
): result is ActionResult<T> & { error: string } {
  return !result.success && result.error !== undefined;
}

// ============================================
// RE-EXPORT PRISMA ENUMS
// ============================================

export type { OrderStatus, BookingStatus, LeadStatus, LeadSource };

// Re-export for convenience
export type {
  Product,
  ProductImage,
  Inventory,
  Order,
  OrderItem,
  Booking,
  Lead,
  Customer,
  Admin,
};
