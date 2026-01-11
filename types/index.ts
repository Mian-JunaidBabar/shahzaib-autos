export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  vehicleInfo?: string;
  preferredDate: string;
  preferredTime: string;
  address?: string;
  notes?: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: "cod" | "bank-transfer";
}

export interface FAQItem {
  question: string;
  answer: string;
}
