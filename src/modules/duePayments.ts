import { apiClient } from '../lib/axios';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ==========================================
// Due Payments (Receivables / Debts) Types
// ==========================================

export type DueType = 'Subscription' | 'ExternalEntity' | 'Sale';
export type DuePaymentStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid';

export interface DuePayment {
  id: number;
  dueType: DueType;
  subscriptionId: number | null;
  saleId: number | null;
  payerName: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string | null;
  status: DuePaymentStatus;
  createdAt: string;
}

export interface DuePaymentListResponse {
  items: DuePayment[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateExternalDebtPayload {
  payerName: string;
  description: string;
  totalAmount: number;
  dueDate?: string | null;
}

export interface DuePaymentQueryParams {
  dueType?: DueType | '';
  status?: DuePaymentStatus | '';
  subscriptionId?: number;
  saleId?: number;
  page?: number;
  pageSize?: number;
}

// ==========================================
// Due Payment Transactions Types
// ==========================================

export interface DuePaymentTransaction {
  id: number;
  duePaymentId: number;
  payerName: string;
  amountPaid: number;
  paymentDate: string;
  cashboxType?: string;
}

export interface DuePaymentTransactionListResponse {
  items: DuePaymentTransaction[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateDuePaymentTransactionPayload {
  duePaymentId: number;
  amountPaid: number;
  idempotencyKey: string;
}

export interface DuePaymentTransactionQueryParams {
  duePaymentId?: number;
  page?: number;
  pageSize?: number;
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const duePaymentKeys = {
  all: ['due-payments'] as const,
  lists: () => [...duePaymentKeys.all, 'list'] as const,
  list: (params?: DuePaymentQueryParams) => [...duePaymentKeys.lists(), params] as const,
  details: () => [...duePaymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...duePaymentKeys.details(), id] as const,
};

export const duePaymentTransactionKeys = {
  all: ['due-payment-transactions'] as const,
  lists: () => [...duePaymentTransactionKeys.all, 'list'] as const,
  list: (params?: DuePaymentTransactionQueryParams) =>
    [...duePaymentTransactionKeys.lists(), params] as const,
  details: () => [...duePaymentTransactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...duePaymentTransactionKeys.details(), id] as const,
};

// ==========================================
// Helper Utility for Idempotency Key
// ==========================================

export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
}

// ==========================================
// API Clients
// ==========================================

export const duePaymentsApi = {
  getAll: async (params?: DuePaymentQueryParams): Promise<DuePaymentListResponse> => {
    const res = await apiClient.get<DuePaymentListResponse>('/api/duepayments', {
      params: {
        dueType: params?.dueType || undefined,
        status: params?.status || undefined,
        subscriptionId: params?.subscriptionId || undefined,
        saleId: params?.saleId || undefined,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<DuePayment> => {
    const res = await apiClient.get<DuePayment>(`/api/duepayments/${id}`);
    return res.data;
  },

  createExternalDebt: async (
    payload: CreateExternalDebtPayload
  ): Promise<ApiResponse<DuePayment>> => {
    const res = await apiClient.post<ApiResponse<DuePayment>>('/api/duepayments', payload);
    return res.data;
  },
};

export const duePaymentTransactionsApi = {
  getAll: async (
    params?: DuePaymentTransactionQueryParams
  ): Promise<DuePaymentTransactionListResponse> => {
    const res = await apiClient.get<DuePaymentTransactionListResponse>(
      '/api/due-payment-transactions',
      {
        params: {
          duePaymentId: params?.duePaymentId || undefined,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 20,
        },
      }
    );
    return res.data;
  },

  getById: async (id: number): Promise<DuePaymentTransaction> => {
    const res = await apiClient.get<DuePaymentTransaction>(
      `/api/due-payment-transactions/${id}`
    );
    return res.data;
  },

  recordTransaction: async (
    payload: CreateDuePaymentTransactionPayload
  ): Promise<ApiResponse<DuePaymentTransaction>> => {
    const res = await apiClient.post<ApiResponse<DuePaymentTransaction>>(
      '/api/due-payment-transactions',
      payload
    );
    return res.data;
  },
};

// ==========================================
// Formatting & Localization Helpers
// ==========================================

export function dueTypeLabel(type: DueType): string {
  switch (type) {
    case 'Subscription':
      return 'اشتراك';
    case 'Sale':
      return 'مبيعات POS';
    case 'ExternalEntity':
      return 'جهة خارجية';
  }
}

export function dueStatusLabel(status: DuePaymentStatus): string {
  switch (status) {
    case 'Paid':
      return 'مسدد بالكامل';
    case 'PartiallyPaid':
      return 'مدفوع جزئياً';
    case 'Unpaid':
      return 'غير مدفوع';
  }
}

