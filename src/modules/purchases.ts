import { apiClient } from '../lib/axios';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ==========================================
// Purchase Invoices Types
// ==========================================

export interface PurchaseInvoiceItem {
  id: number;
  inventoryItemId: number;
  inventoryItemName: string;
  quantity: number;
  unitCost: number;
  totalPrice: number;
}

export interface PurchaseInvoice {
  id: number;
  supplierId: number;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes: string | null;
  createdAt: string;
  items?: PurchaseInvoiceItem[];
}

export interface PurchaseInvoiceListResponse {
  items: PurchaseInvoice[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreatePurchaseInvoiceItemPayload {
  inventoryItemId: number;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseInvoicePayload {
  supplierId: number;
  invoiceNumber: string;
  invoiceDate: string;
  notes?: string;
  items: CreatePurchaseInvoiceItemPayload[];
}

export interface UpdatePurchaseInvoicePayload {
  supplierId: number;
  invoiceNumber: string;
  invoiceDate: string;
  notes?: string;
  items: CreatePurchaseInvoiceItemPayload[];
}

export interface PurchaseInvoiceQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// ==========================================
// Purchase Invoice Payments Types
// ==========================================

export interface PurchaseInvoicePayment {
  id: number;
  purchaseInvoiceId: number;
  invoiceNumber: string;
  supplierName: string;
  amountPaid: number;
  paymentDate: string;
  cashboxType?: string;
}

export interface PurchasePaymentListResponse {
  items: PurchaseInvoicePayment[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreatePurchasePaymentPayload {
  purchaseInvoiceId: number;
  amountPaid: number;
  paymentDate: string;
}

export interface UpdatePurchasePaymentPayload {
  purchaseInvoiceId: number;
  amountPaid: number;
  paymentDate: string;
}

export interface PurchasePaymentQueryParams {
  page?: number;
  pageSize?: number;
  purchaseInvoiceId?: number;
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const purchaseInvoiceKeys = {
  all: ['purchase-invoices'] as const,
  lists: () => [...purchaseInvoiceKeys.all, 'list'] as const,
  list: (params?: PurchaseInvoiceQueryParams) =>
    [...purchaseInvoiceKeys.lists(), params] as const,
  details: () => [...purchaseInvoiceKeys.all, 'detail'] as const,
  detail: (id: number) => [...purchaseInvoiceKeys.details(), id] as const,
};

export const purchasePaymentKeys = {
  all: ['purchase-payments'] as const,
  lists: () => [...purchasePaymentKeys.all, 'list'] as const,
  list: (params?: PurchasePaymentQueryParams) =>
    [...purchasePaymentKeys.lists(), params] as const,
  details: () => [...purchasePaymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...purchasePaymentKeys.details(), id] as const,
};

// ==========================================
// API Clients
// ==========================================

export const purchaseInvoicesApi = {
  getAll: async (params?: PurchaseInvoiceQueryParams): Promise<PurchaseInvoiceListResponse> => {
    const res = await apiClient.get<PurchaseInvoiceListResponse>('/api/purchaseinvoices', {
      params: {
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<PurchaseInvoice> => {
    const res = await apiClient.get<PurchaseInvoice>(`/api/purchaseinvoices/${id}`);
    return res.data;
  },

  create: async (payload: CreatePurchaseInvoicePayload): Promise<ApiResponse<PurchaseInvoice>> => {
    const res = await apiClient.post<ApiResponse<PurchaseInvoice>>('/api/purchaseinvoices', payload);
    return res.data;
  },

  update: async (id: number, payload: UpdatePurchaseInvoicePayload): Promise<ApiResponse<PurchaseInvoice>> => {
    const res = await apiClient.put<ApiResponse<PurchaseInvoice>>(`/api/purchaseinvoices/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await apiClient.delete<ApiResponse<string>>(`/api/purchaseinvoices/${id}`);
    return res.data;
  },
};

export const purchasePaymentsApi = {
  getAll: async (params?: PurchasePaymentQueryParams): Promise<PurchasePaymentListResponse> => {
    const res = await apiClient.get<PurchasePaymentListResponse>('/api/purchaseinvoicepayments', {
      params: {
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 20,
        PurchaseInvoiceId: params?.purchaseInvoiceId || undefined,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<PurchaseInvoicePayment> => {
    const res = await apiClient.get<PurchaseInvoicePayment>(`/api/purchaseinvoicepayments/${id}`);
    return res.data;
  },

  create: async (payload: CreatePurchasePaymentPayload): Promise<ApiResponse<PurchaseInvoicePayment>> => {
    const res = await apiClient.post<ApiResponse<PurchaseInvoicePayment>>('/api/purchaseinvoicepayments', payload);
    return res.data;
  },

  update: async (id: number, payload: UpdatePurchasePaymentPayload): Promise<ApiResponse<PurchaseInvoicePayment>> => {
    const res = await apiClient.put<ApiResponse<PurchaseInvoicePayment>>(`/api/purchaseinvoicepayments/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await apiClient.delete<ApiResponse<string>>(`/api/purchaseinvoicepayments/${id}`);
    return res.data;
  },
};

