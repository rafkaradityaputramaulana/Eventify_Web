export type UserRole = 'admin' | 'organizer' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
  status?: 'active' | 'inactive';
}

export type EventStatus = 'published' | 'draft' | 'ended' | 'suspended';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  description?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  organizer_id: string;
  organizer_name: string;
  poster_url: string;
  start_date: string;
  end_date: string;
  location: string;
  is_online: boolean;
  status: EventStatus;
  total_quota: number;
  sold_tickets: number;
  ticket_tiers: TicketTier[];
  created_at: string;
}

export type OrderStatus = 'paid' | 'pending' | 'cancelled';

export interface OrderItem {
  ticket_tier_id: string;
  ticket_tier_name: string;
  quantity: number;
  price_per_item: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string;
  user_name: string;
  user_email: string;
  event_id: string;
  event_title: string;
  total_amount: number;
  payment_method: 'qris' | 'bca_va' | 'mandiri_va' | 'gopay';
  status: OrderStatus;
  created_at: string;
  payment_details: {
    qris_url?: string;
    va_number?: string;
    expiry_time?: string;
  };
  items: OrderItem[];
}

export interface DailyTransaction {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  active_events: number;
  tickets_sold: number;
  gate_scans: number;
  total_revenue: number;
  daily_transactions: DailyTransaction[];
  recent_orders: Order[];
  recent_events: EventItem[];
}

export interface SystemConfig {
  maintenance_mode: boolean;
  maintenance_message: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
