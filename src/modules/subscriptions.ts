import { apiClient } from '../lib/axios';

/**
 * Subscriptions Domain Models & API Services
 * Based on backendMD/Subscriptions.md
 */

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export type ClientType = 'Academy' | 'External';
export type SubscriptionType = 'Sessions' | 'Duration' | 'PrivateTraining';
export type SubscriptionStatus = 'Active' | 'Completed' | 'Expired' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid';

export interface Subscription {
  id: number;
  clientId: number;
  clientName: string;
  commissionCoachId: number | null;
  commissionCoachName: string | null;
  clientType: ClientType;
  subscriptionType: SubscriptionType;
  startDate: string;
  endDate: string;
  totalSessions: number;
  usedSessions: number;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  status: SubscriptionStatus;
  createdAt: string;
  notes: string | null;
}

export interface SubscriptionListResponse {
  items: Subscription[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateSubscriptionPayload {
  clientId: number;
  commissionCoachId?: number | null;
  clientType: ClientType;
  subscriptionType: SubscriptionType;
  startDate: string;
  endDate: string;
  totalSessions: number;
  amount: number;
  discountAmount: number;
  paidAmount: number;
  notes?: string | null;
}

export interface UpdateSubscriptionPayload {
  commissionCoachId?: number | null;
  clientType: ClientType;
  subscriptionType: SubscriptionType;
  startDate: string;
  endDate: string;
  totalSessions: number;
  amount: number;
  discountAmount: number;
  paidAmount: number;
  notes?: string | null;
}

export interface SubscriptionQueryParams {
  clientId?: number;
  status?: SubscriptionStatus;
  paymentStatus?: PaymentStatus;
  page?: number;
  pageSize?: number;
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (params?: SubscriptionQueryParams) => [...subscriptionKeys.lists(), params] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: number) => [...subscriptionKeys.details(), id] as const,
};

// ─── API Client ──────────────────────────────────────────────────────────────

export const subscriptionsApi = {
  /** GET /api/subscriptions */
  getAll: async (params?: SubscriptionQueryParams): Promise<SubscriptionListResponse> => {
    const res = await apiClient.get<SubscriptionListResponse>('/api/subscriptions', {
      params: {
        ClientId: params?.clientId || undefined,
        Status: params?.status || undefined,
        PaymentStatus: params?.paymentStatus || undefined,
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 10,
      },
    });
    return res.data;
  },

  /** GET /api/subscriptions/:id */
  getById: async (id: number): Promise<Subscription> => {
    const res = await apiClient.get<Subscription>(`/api/subscriptions/${id}`);
    return res.data;
  },

  /** POST /api/subscriptions */
  create: async (payload: CreateSubscriptionPayload): Promise<ApiResponse<Subscription>> => {
    const res = await apiClient.post<ApiResponse<Subscription>>('/api/subscriptions', payload);
    return res.data;
  },

  /** PUT /api/subscriptions/:id */
  update: async (id: number, payload: UpdateSubscriptionPayload): Promise<ApiResponse<Subscription>> => {
    const res = await apiClient.put<ApiResponse<Subscription>>(`/api/subscriptions/${id}`, payload);
    return res.data;
  },

  /** DELETE /api/subscriptions/:id */
  delete: async (id: number): Promise<ApiResponse<Subscription>> => {
    const res = await apiClient.delete<ApiResponse<Subscription>>(`/api/subscriptions/${id}`);
    return res.data;
  },
};

// ─── Localization & UI Helpers ───────────────────────────────────────────────

export function clientTypeLabel(type: ClientType): string {
  return type === 'Academy' ? 'أكاديمية' : 'خارجي';
}

export function subscriptionTypeLabel(type: SubscriptionType): string {
  switch (type) {
    case 'Sessions': return 'بالحصص';
    case 'Duration': return 'بالمدة الزمنية';
    case 'PrivateTraining': return 'تدريب خاص';
  }
}

export function subscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case 'Active': return 'نشط';
    case 'Completed': return 'مكتمل';
    case 'Expired': return 'منتهي';
    case 'Cancelled': return 'ملغي';
  }
}

export function subscriptionStatusBadgeClass(status: SubscriptionStatus): string {
  switch (status) {
    case 'Active': return 'active';       // Green
    case 'Completed': return 'completed'; // Blue
    case 'Expired': return 'inactive';    // Red
    case 'Cancelled': return 'cancelled'; // Gray / Muted
  }
}

export function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'Paid': return 'مدفوع بالكامل';
    case 'PartiallyPaid': return 'مدفوع جزئياً';
    case 'Unpaid': return 'غير مدفوع';
  }
}

export function paymentStatusBadgeClass(status: PaymentStatus): string {
  switch (status) {
    case 'Paid': return 'active';       // Green
    case 'PartiallyPaid': return 'partial'; // Orange
    case 'Unpaid': return 'inactive';   // Red
  }
}

