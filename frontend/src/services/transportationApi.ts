import { config } from '../config';

// Base API functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Transfer Types API
export const transferTypesApi = {
  getAll: () => apiCall('/transfer-types/'),
  getById: (id: number) => apiCall(`/transfer-types/${id}/`),
  create: (data: any) => apiCall('/transfer-types/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-types/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-types/${id}/`, {
    method: 'DELETE',
  }),
};

// Atoll Transfers API
export const atollTransfersApi = {
  getAll: () => apiCall('/atoll-transfers/'),
  getById: (id: number) => apiCall(`/atoll-transfers/${id}/`),
  create: (data: any) => apiCall('/atoll-transfers/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/atoll-transfers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/atoll-transfers/${id}/`, {
    method: 'DELETE',
  }),
};

// Resort Transfers API
export const resortTransfersApi = {
  getAll: () => apiCall('/resort-transfers/'),
  getById: (id: number) => apiCall(`/resort-transfers/${id}/`),
  create: (data: any) => apiCall('/resort-transfers/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/resort-transfers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/resort-transfers/${id}/`, {
    method: 'DELETE',
  }),
};

// Transfer FAQs API
export const transferFaqsApi = {
  getAll: () => apiCall('/transfer-faqs/'),
  getById: (id: number) => apiCall(`/transfer-faqs/${id}/`),
  create: (data: any) => apiCall('/transfer-faqs/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-faqs/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-faqs/${id}/`, {
    method: 'DELETE',
  }),
};

// Transfer Contact Methods API
export const transferContactMethodsApi = {
  getAll: () => apiCall('/transfer-contact-methods/'),
  getById: (id: number) => apiCall(`/transfer-contact-methods/${id}/`),
  create: (data: any) => apiCall('/transfer-contact-methods/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-contact-methods/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-contact-methods/${id}/`, {
    method: 'DELETE',
  }),
};

// Transfer Booking Steps API
export const transferBookingStepsApi = {
  getAll: () => apiCall('/transfer-booking-steps/'),
  getById: (id: number) => apiCall(`/transfer-booking-steps/${id}/`),
  create: (data: any) => apiCall('/transfer-booking-steps/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-booking-steps/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-booking-steps/${id}/`, {
    method: 'DELETE',
  }),
};

// Transfer Benefits API
export const transferBenefitsApi = {
  getAll: () => apiCall('/transfer-benefits/'),
  getById: (id: number) => apiCall(`/transfer-benefits/${id}/`),
  create: (data: any) => apiCall('/transfer-benefits/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-benefits/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-benefits/${id}/`, {
    method: 'DELETE',
  }),
};

// Transfer Pricing Factors API
export const transferPricingFactorsApi = {
  getAll: () => apiCall('/transfer-pricing-factors/'),
  getById: (id: number) => apiCall(`/transfer-pricing-factors/${id}/`),
  create: (data: any) => apiCall('/transfer-pricing-factors/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-pricing-factors/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-pricing-factors/${id}/`, {
    method: 'DELETE',
  }),
};

// Transfer Content API
export const transferContentApi = {
  getAll: () => apiCall('/transfer-content/'),
  getById: (id: number) => apiCall(`/transfer-content/${id}/`),
  create: (data: any) => apiCall('/transfer-content/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/transfer-content/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/transfer-content/${id}/`, {
    method: 'DELETE',
  }),
}; 