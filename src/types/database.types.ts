export type UserRole = 'customer' | 'staff' | 'admin';

export type DesignStatus = 'DRAFT' | 'READY' | 'ARCHIVED';

export type GenerationType = 'CHAT' | 'REFERENCE_ANALYSIS' | 'PREVIEW' | 'SUGGESTION';

export type OrderType = 'PICKUP' | 'DELIVERY';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderStatus =
  | 'PENDING_REVIEW'
  | 'PRICE_CONFIRMATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'DECORATING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  preferred_flavor?: string;
  preferred_frosting?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CakeCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  base_price: number;
  active: boolean;
  created_at?: string;
}

export interface CakeFlavor {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_modifier: number;
  active: boolean;
  created_at?: string;
}

export interface Frosting {
  id: string;
  name: string;
  description: string;
  price_modifier: number;
  active: boolean;
  created_at?: string;
}

export interface CakeSize {
  id: string;
  name: string;
  weight_kg: number;
  servings: string;
  price_modifier: number;
  active: boolean;
}

export interface Decoration {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  price_modifier: number;
  active: boolean;
}

export interface CakeDesign {
  id: string;
  user_id: string;
  name: string;
  occasion: string;
  category_id?: string;
  flavor_id?: string;
  frosting_id?: string;
  size_id?: string;
  shape: string;
  tiers: number;
  theme: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  decorations: string[];
  cake_message?: string;
  special_requirements?: string;
  reference_image_url?: string;
  ai_preview_url?: string;
  ai_analysis?: Record<string, any>;
  estimated_price: number;
  status: DesignStatus;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
  
  // Joins
  category?: CakeCategory;
  flavor?: CakeFlavor;
  frosting?: Frosting;
  size?: CakeSize;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  design_id: string;
  assigned_staff_id?: string;
  order_type: OrderType;
  delivery_address_id?: string;
  requested_date: string;
  requested_time: string;
  customer_notes?: string;
  estimated_price: number;
  final_price?: number;
  customer_confirmed_price: boolean;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;

  // Joins
  design?: CakeDesign;
  customer?: Profile;
  assigned_staff?: Profile;
  delivery_address?: Address;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  message: string;
  updated_by?: string;
  updater_name?: string;
  created_at: string;
}

export interface OrderNote {
  id: string;
  order_id: string;
  author_id: string;
  author_name?: string;
  note: string;
  internal: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  order_id?: string;
  read: boolean;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  provider: string;
  transaction_id: string;
  status: PaymentStatus;
  created_at: string;
}
