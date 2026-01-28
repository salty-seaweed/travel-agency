/**
 * BML Payment Gateway API Client
 * Handles all API calls related to BML payment gateway
 */
import { config } from '../config';
import type {
  Payment,
  PaymentLink,
  PaymentCreateRequest,
  PaymentLinkCreateRequest,
  PaymentResponse,
  MerchantInfo,
} from '../types/payment';

const API_BASE = config.apiBaseUrl;

/**
 * Create a payment session with BML gateway
 */
export async function createPayment(
  data: PaymentCreateRequest
): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE}/payments/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to create payment');
  }

  return response.json();
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: number): Promise<Payment> {
  const response = await fetch(`${API_BASE}/payments/${paymentId}/status/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to get payment status');
  }

  return response.json();
}

/**
 * Create a standalone payment link (admin only)
 */
export async function createPaymentLink(
  data: PaymentLinkCreateRequest,
  token: string
): Promise<PaymentLink> {
  const response = await fetch(`${API_BASE}/payments/links/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to create payment link');
  }

  return response.json();
}

/**
 * Get payment link details by token
 */
export async function getPaymentLink(token: string): Promise<PaymentLink> {
  const response = await fetch(`${API_BASE}/payments/links/${token}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Payment link not found');
  }

  return response.json();
}

/**
 * List all payment links (admin only)
 */
export async function listPaymentLinks(token: string): Promise<PaymentLink[]> {
  const response = await fetch(`${API_BASE}/payments/links/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to list payment links');
  }

  return response.json();
}

/**
 * List all payments (admin only)
 */
export async function listPayments(token: string): Promise<Payment[]> {
  const response = await fetch(`${API_BASE}/payments/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to list payments');
  }

  return response.json();
}

/**
 * Get merchant information for compliance display
 */
export async function getMerchantInfo(): Promise<MerchantInfo> {
  const response = await fetch(`${API_BASE}/merchant-info/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to get merchant info');
  }

  return response.json();
}

