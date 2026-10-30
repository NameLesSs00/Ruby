import { apiClient } from '../lib/axios';

/**
 * Coaches Domain Models & API Services
 * Based on backendMD/Coaches.md
 */

export interface Coach {
  id: number;
  fullName: string;
  phoneNumber: string;
  hireDate: string; // YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
  notes: string | null;
}

export interface CoachListResponse {
  items: Coach[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateCoachPayload {
  fullName: string;
  phoneNumber: string;
  hireDate: string;
  notes?: string;
}

export interface UpdateCoachPayload {
  fullName: string;
  phoneNumber: string;
  hireDate: string;
  notes?: string;
}

export interface CoachQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const coachKeys = {
  all: ['coaches'] as const,
  lists: () => [...coachKeys.all, 'list'] as const,
  list: (params: CoachQueryParams) => [...coachKeys.lists(), params] as const,
  details: () => [...coachKeys.all, 'detail'] as const,
  detail: (id: number) => [...coachKeys.details(), id] as const,
};

export const coachesApi = {
  getAll: async (params: CoachQueryParams): Promise<CoachListResponse> => {
    const response = await apiClient.get<CoachListResponse>('/api/coaches', {
      params: {
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 10,
        Search: params.search || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Coach> => {
    const response = await apiClient.get<Coach>(`/api/coaches/${id}`);
    return response.data;
  },

  create: async (payload: CreateCoachPayload): Promise<ApiResponse<Coach>> => {
    const response = await apiClient.post<ApiResponse<Coach>>('/api/coaches', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateCoachPayload): Promise<ApiResponse<Coach>> => {
    const response = await apiClient.put<ApiResponse<Coach>>(`/api/coaches/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<Coach>> => {
    const response = await apiClient.patch<ApiResponse<Coach>>(`/api/coaches/${id}/status`, {
      isActive,
    });
    return response.data;
  },
};

