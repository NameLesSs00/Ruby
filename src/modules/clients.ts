import { apiClient } from '../lib/axios';

/**
 * Clients (العملاء) Domain Models & API Services
 * Based on backendMD/clinets.md
 */

export interface Client {
  id: number;
  clientCode: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
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
  dateOfBirth: string;
}

export interface UpdateClientPayload {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface ClientBarcodeResponse {
  clientId: number;
  clientCode: string;
  barcodeUrl: string;
}

export interface ClientQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
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
  barcode: (id: number) => [...clientKeys.all, 'barcode', id] as const,
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

  getBarcode: async (id: number): Promise<ClientBarcodeResponse> => {
    const response = await apiClient.get<ClientBarcodeResponse>(`/api/clients/${id}/barcode`);
    return response.data;
  },

  getByBarcode: async (clientCode: string) => {
    const response = await apiClient.get(`/api/clients/by-barcode/${clientCode}`);
    return response.data;
  },
};

