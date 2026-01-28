// Payment-related types for BML payment gateway integration

export interface Payment {
  id: number;
  transaction_id: string;
  bml_reference?: string;
  amount: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_method: 'bml' | 'card';
  booking_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  description?: string;
  bml_session_id?: string;
  bml_payment_url?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  is_successful: boolean;
  is_pending: boolean;
}

export interface PaymentLink {
  id: number;
  token: string;
  amount: string;
  currency: string;
  description: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  expires_at?: string;
  payment_url: string;
  is_valid: boolean;
  is_expired: boolean;
  notes?: string;
  created_by_username?: string;
  created_at: string;
  updated_at: string;
  used_at?: string;
}

export interface PaymentCreateRequest {
  amount: number;
  currency?: string;
  description?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_id?: number;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentLinkCreateRequest {
  amount: number;
  currency?: string;
  description: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  expires_in_days?: number;
  expires_at?: string;
  notes?: string;
}

export interface PaymentResponse {
  payment_id: number;
  transaction_id: string;
  payment_url: string;
  status: string;
}

export interface MerchantInfo {
  id?: number;
  trading_name: string;
  company_name: string;
  complete_address: string;
  postal_address: string;
  email: string;
  phone: string;
  customer_service_phone?: string;
  customer_service_email?: string;
  website?: string;
  registration_number?: string;
  is_active?: boolean;
}

