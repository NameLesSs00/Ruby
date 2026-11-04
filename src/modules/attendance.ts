import { apiClient } from '../lib/axios';

/**
 * Attendance Records (سجلات الحضور والانصراف) Domain Models & API Services
 * Based on backendMD/AttendanceRecords.md
 */

export interface AttendanceRecord {
  id: number;
  clientId: number;
  clientName: string;
  subscriptionId: number;
  checkInTime: string; // ISO date-time
  notes?: string | null;
}

export interface AttendanceListResponse {
  items: AttendanceRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AttendanceQueryParams {
  clientId?: number;
  subscriptionId?: number;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
  page?: number;
  pageSize?: number;
}

export interface CreateAttendancePayload {
  clientId: number;
  subscriptionId: number;
  notes?: string;
}

export interface UpdateAttendancePayload {
  clientId: number;
  subscriptionId: number;
  checkInTime: string;
  notes?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const attendanceKeys = {
  all: ['attendance-records'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params?: AttendanceQueryParams) => [...attendanceKeys.lists(), params] as const,
  today: () => [...attendanceKeys.all, 'today'] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: number) => [...attendanceKeys.details(), id] as const,
};

export const attendanceApi = {
  getAll: async (params?: AttendanceQueryParams): Promise<AttendanceListResponse> => {
    const response = await apiClient.get<AttendanceListResponse>('/api/attendance-records', {
      params: {
        ClientId: params?.clientId,
        SubscriptionId: params?.subscriptionId,
        FromDate: params?.fromDate,
        ToDate: params?.toDate,
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 15,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<AttendanceRecord> => {
    const response = await apiClient.get<AttendanceRecord>(`/api/attendance-records/${id}`);
    return response.data;
  },

  create: async (payload: CreateAttendancePayload): Promise<ApiResponse<AttendanceRecord>> => {
    const response = await apiClient.post<ApiResponse<AttendanceRecord>>('/api/attendance-records', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateAttendancePayload): Promise<ApiResponse<AttendanceRecord>> => {
    const response = await apiClient.put<ApiResponse<AttendanceRecord>>(`/api/attendance-records/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<AttendanceRecord>> => {
    const response = await apiClient.delete<ApiResponse<AttendanceRecord>>(`/api/attendance-records/${id}`);
    return response.data;
  },
};

