import { apiClient } from '../lib/axios';
import type { PaymentMethod } from './duePayments';
import type { SaleStatus } from './pos';

/**
 * Employee Sales Domain Models & API Services
 * Based on backendMD/employeesale.md
 */

export interface EmployeeSaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface EmployeeSaleRecord {
  id: number;
  invoiceNumber: string;
  saleDate: string;
  saleType: 'Employee' | 'Customer';
  employeeId: number;
  employeeName: string;
  totalAmount: number;
  discountAmount?: number | null;
  finalAmount: number;
  status: SaleStatus;
  notes?: string | null;
  items: EmployeeSaleItem[];
}

export interface EmployeeSaleListResponse {
  items: EmployeeSaleRecord[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface CreateEmployeeSaleItemPayload {
  productId: number;
  quantity: number;
}

export interface EmployeeSalePaymentItem {
  paymentMethod: PaymentMethod;
  amount: number;
}

export interface CreateEmployeeSalePayload {
  employeeId: number;
  items: CreateEmployeeSaleItemPayload[];
  amountPaid: number;
  payments: EmployeeSalePaymentItem[];
  notes?: string | null;
}

export interface EmployeeSaleQueryParams {
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const employeeSaleKeys = {
  all: ['employee-sales'] as const,
  lists: () => [...employeeSaleKeys.all, 'list'] as const,
  list: (params?: EmployeeSaleQueryParams) => [...employeeSaleKeys.lists(), params] as const,
  details: () => [...employeeSaleKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeSaleKeys.details(), id] as const,
};

export const employeeSalesApi = {
  getAll: async (params?: EmployeeSaleQueryParams): Promise<EmployeeSaleListResponse> => {
    const res = await apiClient.get<EmployeeSaleListResponse>('/api/employee-sales', {
      params: {
        FromDate: params?.fromDate || undefined,
        ToDate: params?.toDate || undefined,
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 20,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<EmployeeSaleRecord> => {
    const res = await apiClient.get<ApiResponse<EmployeeSaleRecord>>(`/api/employee-sales/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateEmployeeSalePayload): Promise<ApiResponse<EmployeeSaleRecord>> => {
    const res = await apiClient.post<ApiResponse<EmployeeSaleRecord>>('/api/employee-sales', payload);
    return res.data;
  },
};

