import { apiClient } from '../lib/axios';
import type { SubscriptionListResponse, SubscriptionStatus } from './subscriptions';

/**
 * Clients (العملاء) Domain Models & API Services
 * Based on backendMD/newClinet.md
 */

export interface Client {
  id: number;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null; // YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
  barcode: string | null;
}

export interface ClientListResponse {
  items: Client[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateClientPayload {
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
  barcode: string;
}

export interface UpdateClientPayload {
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
  barcode: string;
}

export interface ClientQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ClientSubscriptionsQueryParams {
  barcode?: string;
  subscriptionStatus?: SubscriptionStatus | '';
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params: ClientQueryParams) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: number) => [...clientKeys.details(), id] as const,
  subscriptions: (params: ClientSubscriptionsQueryParams) =>
    [...clientKeys.all, 'subscriptions', params] as const,
};

export const clientsApi = {
  getAll: async (params: ClientQueryParams): Promise<ClientListResponse> => {
    const response = await apiClient.get<ClientListResponse>('/api/clients', {
      params: {
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 10,
        Search: params.search || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient.get<Client>(`/api/clients/${id}`);
    return response.data;
  },

  create: async (payload: CreateClientPayload): Promise<ApiResponse<Client>> => {
    const response = await apiClient.post<ApiResponse<Client>>('/api/clients', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateClientPayload): Promise<ApiResponse<Client>> => {
    const response = await apiClient.put<ApiResponse<Client>>(`/api/clients/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<Client>> => {
    const response = await apiClient.patch<ApiResponse<Client>>(`/api/clients/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  getSubscriptions: async (
    params: ClientSubscriptionsQueryParams
  ): Promise<SubscriptionListResponse> => {
    const response = await apiClient.get<SubscriptionListResponse>('/api/clients/subscriptions', {
      params: {
        barcode: params.barcode || undefined,
        subscriptionStatus: params.subscriptionStatus || undefined,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
      },
    });
    return response.data;
  },
};
