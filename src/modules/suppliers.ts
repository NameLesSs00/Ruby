import { apiClient } from '../lib/axios';

/**
 * Suppliers Domain Models & API Services
 * Based on backendMD/Suppliers+products.md
 */

export interface Supplier {
  id: number;
  name: string;
  companyName: string;
  phoneNumber: string;
  address: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierListResponse {
  items: Supplier[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateSupplierPayload {
  name: string;
  companyName: string;
  phoneNumber: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierPayload extends CreateSupplierPayload {}

export interface SupplierQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params: SupplierQueryParams) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: number) => [...supplierKeys.details(), id] as const,
};

export const suppliersApi = {
  getAll: async (params: SupplierQueryParams): Promise<SupplierListResponse> => {
    const response = await apiClient.get<SupplierListResponse>('/api/suppliers', {
      params: {
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 10,
        Search: params.search || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await apiClient.get<Supplier>(`/api/suppliers/${id}`);
    return response.data;
  },

  create: async (payload: CreateSupplierPayload): Promise<ApiResponse<Supplier>> => {
    const response = await apiClient.post<ApiResponse<Supplier>>('/api/suppliers', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateSupplierPayload): Promise<ApiResponse<Supplier>> => {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/api/suppliers/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<Supplier>> => {
    const response = await apiClient.patch<ApiResponse<Supplier>>(`/api/suppliers/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/api/suppliers/${id}`);
    return response.data;
  },
};

