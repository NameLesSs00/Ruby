import { apiClient } from '../lib/axios';

/**
 * Product Categories & Products Domain Models & API Services
 * Based on backendMD/Suppliers+products.md
 */

// ==========================================
// Product Categories Types
// ==========================================

export interface ProductCategory {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductCategoryListResponse {
  items: ProductCategory[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateProductCategoryPayload {
  name: string;
}

export interface UpdateProductCategoryPayload {
  name: string;
}

export interface ProductCategoryQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// ==========================================
// Products Types
// ==========================================

export interface Product {
  id: number;
  productCategoryId: number;
  productCategoryName: string;
  name: string;
  salePrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateProductPayload {
  productCategoryId: number;
  name: string;
  salePrice: number;
}

export interface UpdateProductPayload extends CreateProductPayload {}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const categoryKeys = {
  all: ['product-categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params: ProductCategoryQueryParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// ==========================================
// API Services
// ==========================================

export const productCategoriesApi = {
  getAll: async (params: ProductCategoryQueryParams): Promise<ProductCategoryListResponse> => {
    const response = await apiClient.get<ProductCategoryListResponse>('/api/product-categories', {
      params: {
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 50,
        Search: params.search || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<ProductCategory> => {
    const response = await apiClient.get<ProductCategory>(`/api/product-categories/${id}`);
    return response.data;
  },

  create: async (payload: CreateProductCategoryPayload): Promise<ApiResponse<ProductCategory>> => {
    const response = await apiClient.post<ApiResponse<ProductCategory>>('/api/product-categories', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateProductCategoryPayload): Promise<ApiResponse<ProductCategory>> => {
    const response = await apiClient.put<ApiResponse<ProductCategory>>(`/api/product-categories/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<ProductCategory>> => {
    const response = await apiClient.patch<ApiResponse<ProductCategory>>(`/api/product-categories/${id}/status`, {
      isActive,
    });
    return response.data;
  },
};

export const productsApi = {
  getAll: async (params: ProductQueryParams): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>('/api/products', {
      params: {
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 10,
        Search: params.search || undefined,
        CategoryId: params.categoryId || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  create: async (payload: CreateProductPayload): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post<ApiResponse<Product>>('/api/products', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateProductPayload): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/api/products/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<Product>> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/api/products/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/api/products/${id}`);
    return response.data;
  },
};

