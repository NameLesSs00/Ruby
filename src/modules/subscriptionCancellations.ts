import { apiClient } from '../lib/axios';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export type CancellationPaymentStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid';

export interface SubscriptionCancellation {
  id: number;
  subscriptionId: number;
  cancellationDate: string;
  reason: string;
  refundAmount: number;
  paidRefundAmount: number;
  remainingRefundAmount: number;
  paymentStatus: CancellationPaymentStatus;
  notes: string;
}

export interface CreateCancellationPayload {
  subscriptionId: number;
  reason: string;
  refundAmount: number;
  notes?: string;
}

export interface RecordRefundPaymentPayload {
  paymentAmount: number;
  cashboxType?: string;
  notes?: string;
}

export const subscriptionCancellationKeys = {
  all: ['subscription-cancellations'] as const,
  lists: () => [...subscriptionCancellationKeys.all, 'list'] as const,
  details: () => [...subscriptionCancellationKeys.all, 'detail'] as const,
  detail: (id: number) => [...subscriptionCancellationKeys.details(), id] as const,
};

export const subscriptionCancellationsApi = {
  getAll: async (): Promise<SubscriptionCancellation[]> => {
    const res = await apiClient.get<SubscriptionCancellation[]>('/api/subscription-cancellations');
    return res.data;
  },

  getById: async (id: number): Promise<SubscriptionCancellation> => {
    const res = await apiClient.get<SubscriptionCancellation>(`/api/subscription-cancellations/${id}`);
    return res.data;
  },

  create: async (payload: CreateCancellationPayload): Promise<ApiResponse<SubscriptionCancellation>> => {
    const res = await apiClient.post<ApiResponse<SubscriptionCancellation>>('/api/subscription-cancellations', payload);
    return res.data;
  },

  recordRefundPayment: async (
    cancellationId: number,
    payload: RecordRefundPaymentPayload
  ): Promise<ApiResponse<SubscriptionCancellation>> => {
    const body = {
      paymentAmount: payload.paymentAmount,
      cashboxType: payload.cashboxType || 'Subscriptions',
      notes: payload.notes || '',
    };
    const res = await apiClient.post<ApiResponse<SubscriptionCancellation>>(
      `/api/subscription-cancellations/${cancellationId}/refund-payments`,
      body
    );
    return res.data;
  },
};

export const CANCELLATION_STATUS_MAP: Record<
  CancellationPaymentStatus,
  { text: string; bg: string; color: string; border: string }
> = {
  Unpaid: { text: 'غير مدفوع', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  PartiallyPaid: { text: 'مدفوع جزئياً', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  Paid: { text: 'مسدد بالكامل', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
};

export function cancellationPaymentStatusLabel(status: CancellationPaymentStatus): string {
  return CANCELLATION_STATUS_MAP[status]?.text || status;
}

