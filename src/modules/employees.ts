import { apiClient } from '../lib/axios';

/**
 * Employees Domain Models & API Services
 * Based on backendMD/Employees.md
 */

export interface Employee {
  id: number;
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  monthlySalary: number;
  hireDate: string; // YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
}

export interface EmployeeListResponse {
  items: Employee[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateEmployeePayload {
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  monthlySalary: number;
  hireDate: string;
}

export interface UpdateEmployeePayload {
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  monthlySalary: number;
  hireDate: string;
}

export interface EmployeeQueryParams {
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: EmployeeQueryParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
};

export const employeesApi = {
  getAll: async (params: EmployeeQueryParams): Promise<EmployeeListResponse> => {
    const response = await apiClient.get<EmployeeListResponse>('/api/employees', {
      params: {
        SearchTerm: params.searchTerm || undefined,
        IsActive: params.isActive !== undefined ? params.isActive : undefined,
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 10,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await apiClient.get<Employee>(`/api/employees/${id}`);
    return response.data;
  },

  create: async (payload: CreateEmployeePayload): Promise<ApiResponse<Employee>> => {
    const response = await apiClient.post<ApiResponse<Employee>>('/api/employees', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateEmployeePayload): Promise<ApiResponse<Employee>> => {
    const response = await apiClient.put<ApiResponse<Employee>>(`/api/employees/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: number, isActive: boolean): Promise<ApiResponse<Employee>> => {
    const response = await apiClient.patch<ApiResponse<Employee>>(`/api/employees/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<Employee>> => {
    const response = await apiClient.delete<ApiResponse<Employee>>(`/api/employees/${id}`);
    return response.data;
  },
};

