import { apiClient } from '../lib/axios';

/**
 * Inventory Categories & Items Domain Models & API Services
 * Based on backendMD/InventoryCategories&Items.md
 */

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ==========================================
// Inventory Categories Types
// ==========================================

export interface InventoryCategory {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface InventoryCategoryListResponse {
  items: InventoryCategory[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateInventoryCategoryPayload {
  name: string;
}

export interface UpdateInventoryCategoryPayload {
  name: string;
}

export interface InventoryCategoryQueryParams {
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// ==========================================
// Inventory Items Types
// ==========================================

export interface InventoryItem {
  id: number;
  inventoryCategoryId: number;
  inventoryCategoryName: string;
  name: string;
  unit: string;
  isActive: boolean;
  createdAt: string;
}

export interface InventoryItemListResponse {
  items: InventoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateInventoryItemPayload {
  inventoryCategoryId: number;
  name: string;
  unit: string;
}

export interface UpdateInventoryItemPayload {
  inventoryCategoryId: number;
  name: string;
  unit: string;
}

export interface InventoryItemQueryParams {
  searchTerm?: string;
  inventoryCategoryId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const inventoryKeys = {
  all: ['inventory'] as const,
  categories: () => [...inventoryKeys.all, 'categories'] as const,
  categoryList: (params?: InventoryCategoryQueryParams) =>
    [...inventoryKeys.categories(), 'list', params] as const,
  items: () => [...inventoryKeys.all, 'items'] as const,
  itemList: (params?: InventoryItemQueryParams) =>
    [...inventoryKeys.items(), 'list', params] as const,
};

// ==========================================
// API Services
// ==========================================

export const inventoryCategoriesApi = {
  getAll: async (params?: InventoryCategoryQueryParams): Promise<InventoryCategoryListResponse> => {
    const res = await apiClient.get<InventoryCategoryListResponse>('/api/inventory-categories', {
      params: {
        SearchTerm: params?.searchTerm || undefined,
        IsActive: params?.isActive,
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 10,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<InventoryCategory> => {
    const res = await apiClient.get<InventoryCategory>(`/api/inventory-categories/${id}`);
    return res.data;
  },

  create: async (payload: CreateInventoryCategoryPayload): Promise<ApiResponse<InventoryCategory>> => {
    const res = await apiClient.post<ApiResponse<InventoryCategory>>('/api/inventory-categories', payload);
    return res.data;
  },

  update: async (id: number, payload: UpdateInventoryCategoryPayload): Promise<ApiResponse<InventoryCategory>> => {
    const res = await apiClient.put<ApiResponse<InventoryCategory>>(`/api/inventory-categories/${id}`, payload);
    return res.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<InventoryCategory>> => {
    const res = await apiClient.patch<ApiResponse<InventoryCategory>>(`/api/inventory-categories/${id}/status`, {
      isActive,
    });
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<InventoryCategory>> => {
    const res = await apiClient.delete<ApiResponse<InventoryCategory>>(`/api/inventory-categories/${id}`);
    return res.data;
  },
};

export const inventoryItemsApi = {
  getAll: async (params?: InventoryItemQueryParams): Promise<InventoryItemListResponse> => {
    const res = await apiClient.get<InventoryItemListResponse>('/api/inventory-items', {
      params: {
        SearchTerm: params?.searchTerm || undefined,
        InventoryCategoryId: params?.inventoryCategoryId || undefined,
        IsActive: params?.isActive,
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 10,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<InventoryItem> => {
    const res = await apiClient.get<InventoryItem>(`/api/inventory-items/${id}`);
    return res.data;
  },

  create: async (payload: CreateInventoryItemPayload): Promise<ApiResponse<InventoryItem>> => {
    const res = await apiClient.post<ApiResponse<InventoryItem>>('/api/inventory-items', payload);
    return res.data;
  },

  update: async (id: number, payload: UpdateInventoryItemPayload): Promise<ApiResponse<InventoryItem>> => {
    const res = await apiClient.put<ApiResponse<InventoryItem>>(`/api/inventory-items/${id}`, payload);
    return res.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<InventoryItem>> => {
    const res = await apiClient.patch<ApiResponse<InventoryItem>>(`/api/inventory-items/${id}/status`, {
      isActive,
    });
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<InventoryItem>> => {
    const res = await apiClient.delete<ApiResponse<InventoryItem>>(`/api/inventory-items/${id}`);
    return res.data;
  },
};

// ==========================================
// Unit Translations & Helper
// ==========================================

export const STANDARD_UNITS: { value: string; label: string }[] = [
  { value: 'Piece', label: 'قطعة (Piece)' },
  { value: 'Carton', label: 'كرتونة (Carton)' },
];

export function getUnitLabel(unit: string): string {
  if (!unit) return '—';
  const found = STANDARD_UNITS.find((u) => u.value.toLowerCase() === unit.toLowerCase());
  return found ? found.label : unit;
}

