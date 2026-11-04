import { apiClient } from '../lib/axios';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ==========================================
// Coach Dues Types (/api/coachdues)
// ==========================================

export interface CoachDue {
  id: number;
  coachId: number;
  coachName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  description: string;
  createdAt: string;
}

export interface CoachDueListResponse {
  items: CoachDue[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface CreateCoachDuePayload {
  coachId: number;
  amount: number;
  description: string;
}

export interface CoachDueQueryParams {
  coachId?: number;
  page?: number;
  pageSize?: number;
}

// ==========================================
// Coach Payments & Advances Types (/api/coachpayments)
// ==========================================

export type CoachPaymentType = 'DuePayment' | 'Advance';

export interface CoachPayment {
  id: number;
  coachId: number;
  coachName: string;
  coachDueId?: number | null;
  paymentType: CoachPaymentType;
  amount: number;
  paymentDate: string;
  cashboxType?: string;
  notes?: string | null;
  createdAt: string;
}

export interface CoachPaymentListResponse {
  items: CoachPayment[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface CreateCoachPaymentPayload {
  coachId: number;
  paymentType: CoachPaymentType;
  coachDueId?: number | null;
  amount: number;
  notes?: string | null;
  idempotencyKey: string;
}

export interface CoachPaymentQueryParams {
  coachId?: number;
  paymentType?: CoachPaymentType | '';
  coachDueId?: number;
  page?: number;
  pageSize?: number;
}

export function generateCoachPaymentIdempotencyKey(prefix = 'coach_pay'): string {
  const timestamp = Date.now();
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);
  return `${prefix}_${timestamp}_${uuid}`;
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const coachDueKeys = {
  all: ['coach-dues'] as const,
  lists: () => [...coachDueKeys.all, 'list'] as const,
  list: (params?: CoachDueQueryParams) => [...coachDueKeys.lists(), params] as const,
  details: () => [...coachDueKeys.all, 'detail'] as const,
  detail: (id: number) => [...coachDueKeys.details(), id] as const,
};

export const coachPaymentKeys = {
  all: ['coach-payments'] as const,
  lists: () => [...coachPaymentKeys.all, 'list'] as const,
  list: (params?: CoachPaymentQueryParams) => [...coachPaymentKeys.lists(), params] as const,
  details: () => [...coachPaymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...coachPaymentKeys.details(), id] as const,
};

// ==========================================
// API Services
// ==========================================

export const coachDuesApi = {
  getAll: async (params?: CoachDueQueryParams): Promise<CoachDueListResponse> => {
    const res = await apiClient.get<CoachDueListResponse>('/api/coachdues', {
      params: {
        coachId: params?.coachId || undefined,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<CoachDue> => {
    const res = await apiClient.get<CoachDue>(`/api/coachdues/${id}`);
    return res.data;
  },

  create: async (payload: CreateCoachDuePayload): Promise<ApiResponse<CoachDue>> => {
    const res = await apiClient.post<ApiResponse<CoachDue>>('/api/coachdues', payload);
    return res.data;
  },
};

export const coachPaymentsApi = {
  getAll: async (params?: CoachPaymentQueryParams): Promise<CoachPaymentListResponse> => {
    const res = await apiClient.get<CoachPaymentListResponse>('/api/coachpayments', {
      params: {
        coachId: params?.coachId || undefined,
        paymentType: params?.paymentType || undefined,
        coachDueId: params?.coachDueId || undefined,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<CoachPayment> => {
    const res = await apiClient.get<CoachPayment>(`/api/coachpayments/${id}`);
    return res.data;
  },

  create: async (payload: CreateCoachPaymentPayload): Promise<ApiResponse<CoachPayment>> => {
    const res = await apiClient.post<ApiResponse<CoachPayment>>('/api/coachpayments', payload);
    return res.data;
  },
};

export function coachPaymentTypeLabel(type: CoachPaymentType): string {
  return type === 'DuePayment' ? 'سداد مستحق' : 'سلفة نقدية';
}

