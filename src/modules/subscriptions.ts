import { apiClient } from '../lib/axios';

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

export interface SubscriptionCoachAssignment {
  id: number;
  subscriptionId: number;
  coachId: number | null;
  coachName: string | null;
  employeeId: number | null;
  employeeName: string | null;
  startDate: string;
  endDate: string;
  notes: string | null;
}

export interface CoachAssignmentListResponse {
  items: SubscriptionCoachAssignment[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateCoachAssignmentPayload {
  subscriptionId: number;
  coachId: number | null;
  employeeId: number | null;
  startDate: string;
  endDate: string;
  notes?: string | null;
}

export type UpdateCoachAssignmentPayload = CreateCoachAssignmentPayload;

export interface CoachAssignmentQueryParams {
  subscriptionId?: number;
  coachId?: number;
  employeeId?: number;
  page?: number;
  pageSize?: number;
}

export type DuePaymentStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid';

export interface SubscriptionDuePayment {
  id: number;
  subscriptionId: number;
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
  items: SubscriptionDuePayment[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface RecordSubscriptionPaymentPayload {
  duePaymentId: number;
  amountPaid: number;
}

export interface RecordSubscriptionPaymentResponse {
  id: number;
  duePaymentId: number;
  amountPaid: number;
  paymentDate: string;
  cashboxId: number;
}

export interface SubscriptionPaymentHistoryItem {
  id: number;
  duePaymentId: number;
  subscriptionId: number;
  payerName: string;
  amountPaid: number;
  paymentDate: string;
  cashboxId: number;
  cashboxName?: string | null;
}

export interface PaymentHistoryListResponse {
  items: SubscriptionPaymentHistoryItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SubscriptionDueQueryParams {
  status?: DuePaymentStatus | '';
  subscriptionId?: number;
  page?: number;
  pageSize?: number;
}

export interface SubscriptionHistoryQueryParams {
  duePaymentId?: number;
  page?: number;
  pageSize?: number;
}

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (params?: SubscriptionQueryParams) => [...subscriptionKeys.lists(), params] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: number) => [...subscriptionKeys.details(), id] as const,
};

export const coachAssignmentKeys = {
  all: ['subscription-coach-assignments'] as const,
  lists: () => [...coachAssignmentKeys.all, 'list'] as const,
  list: (params?: CoachAssignmentQueryParams) => [...coachAssignmentKeys.lists(), params] as const,
  detail: (id: number) => [...coachAssignmentKeys.all, 'detail', id] as const,
};

export const subscriptionDuePaymentKeys = {
  all: ['subscription-due-payments'] as const,
  lists: () => [...subscriptionDuePaymentKeys.all, 'list'] as const,
  list: (params?: SubscriptionDueQueryParams) => [...subscriptionDuePaymentKeys.lists(), params] as const,
  detail: (id: number) => [...subscriptionDuePaymentKeys.all, 'detail', id] as const,
  history: (params?: SubscriptionHistoryQueryParams) => [...subscriptionDuePaymentKeys.all, 'history', params] as const,
};

export const subscriptionsApi = {
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
  getById: async (id: number): Promise<Subscription> => {
    const res = await apiClient.get<Subscription>(`/api/subscriptions/${id}`);
    return res.data;
  },
  create: async (payload: CreateSubscriptionPayload): Promise<ApiResponse<Subscription>> => {
    const res = await apiClient.post<ApiResponse<Subscription>>('/api/subscriptions', payload);
    return res.data;
  },
  update: async (id: number, payload: UpdateSubscriptionPayload): Promise<ApiResponse<Subscription>> => {
    const res = await apiClient.put<ApiResponse<Subscription>>(`/api/subscriptions/${id}`, payload);
    return res.data;
  },
  delete: async (id: number): Promise<ApiResponse<Subscription>> => {
    const res = await apiClient.delete<ApiResponse<Subscription>>(`/api/subscriptions/${id}`);
    return res.data;
  },
};

export const subscriptionCoachAssignmentsApi = {
  getAll: async (params?: CoachAssignmentQueryParams): Promise<CoachAssignmentListResponse> => {
    const res = await apiClient.get<CoachAssignmentListResponse>('/api/subscription-coach-assignments', {
      params: {
        SubscriptionId: params?.subscriptionId || undefined,
        CoachId: params?.coachId || undefined,
        EmployeeId: params?.employeeId || undefined,
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },
  getById: async (id: number): Promise<SubscriptionCoachAssignment> => {
    const res = await apiClient.get<SubscriptionCoachAssignment>(`/api/subscription-coach-assignments/${id}`);
    return res.data;
  },
  create: async (payload: CreateCoachAssignmentPayload): Promise<ApiResponse<SubscriptionCoachAssignment>> => {
    const res = await apiClient.post<ApiResponse<SubscriptionCoachAssignment>>('/api/subscription-coach-assignments', payload);
    return res.data;
  },
  update: async (id: number, payload: UpdateCoachAssignmentPayload): Promise<ApiResponse<SubscriptionCoachAssignment>> => {
    const res = await apiClient.put<ApiResponse<SubscriptionCoachAssignment>>(`/api/subscription-coach-assignments/${id}`, payload);
    return res.data;
  },
  delete: async (id: number): Promise<ApiResponse<SubscriptionCoachAssignment>> => {
    const res = await apiClient.delete<ApiResponse<SubscriptionCoachAssignment>>(`/api/subscription-coach-assignments/${id}`);
    return res.data;
  },
};

export const subscriptionDuePaymentsApi = {
  getAll: async (params?: SubscriptionDueQueryParams): Promise<DuePaymentListResponse> => {
    const res = await apiClient.get<DuePaymentListResponse>('/api/subscription-due-payments', {
      params: {
        status: params?.status || undefined,
        subscriptionId: params?.subscriptionId || undefined,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },
  getById: async (id: number): Promise<SubscriptionDuePayment> => {
    const res = await apiClient.get<SubscriptionDuePayment>(`/api/subscription-due-payments/${id}`);
    return res.data;
  },
  recordPayment: async (payload: RecordSubscriptionPaymentPayload): Promise<ApiResponse<RecordSubscriptionPaymentResponse>> => {
    const res = await apiClient.post<ApiResponse<RecordSubscriptionPaymentResponse>>(
      '/api/subscription-due-payments/record-payment',
      payload
    );
    return res.data;
  },
  getPaymentHistory: async (params?: SubscriptionHistoryQueryParams): Promise<PaymentHistoryListResponse> => {
    const res = await apiClient.get<PaymentHistoryListResponse>('/api/subscription-due-payments/payment-history', {
      params: {
        duePaymentId: params?.duePaymentId || undefined,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },
};

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
    case 'Active': return 'active';
    case 'Completed': return 'completed';
    case 'Expired': return 'inactive';
    case 'Cancelled': return 'cancelled';
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
    case 'Paid': return 'active';
    case 'PartiallyPaid': return 'partial';
    case 'Unpaid': return 'inactive';
  }
}

export function duePaymentStatusLabel(status: DuePaymentStatus): string {
  switch (status) {
    case 'Paid': return 'مسدد بالكامل';
    case 'PartiallyPaid': return 'مدفوع جزئياً';
    case 'Unpaid': return 'غير مدفوع';
  }
}
