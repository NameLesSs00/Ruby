import { apiClient } from '../lib/axios';
import { type CashboxType } from './cashTransactions';

/**
 * Owner Transactions (حركات وسحوبات المالك - سحب وإيداع جاري المالك)
 * Based on backendMD/OwnerTransactions.md
 */

export type OwnerTransactionType = 'Withdrawal' | 'Deposit';

export interface OwnerTransaction {
  id: number;
  transactionType: OwnerTransactionType;
  cashboxType: CashboxType;
  amount: number;
  transactionDate: string; // ISO date-time
  notes?: string | null;
}

export interface OwnerTransactionsResponse {
  items: OwnerTransaction[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateOwnerTransactionPayload {
  transactionType: OwnerTransactionType;
  cashboxType: CashboxType;
  amount: number;
  notes: string;
}

export interface OwnerTransactionQueryParams {
  cashboxType?: CashboxType;
  transactionType?: OwnerTransactionType;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
  pageNumber?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const ownerTransactionTypeLabel = (type: OwnerTransactionType): string => {
  switch (type) {
    case 'Withdrawal':
      return 'سحب للمالك (مسحوبات)';
    case 'Deposit':
      return 'إيداع للمالك (جاري المالك)';
    default:
      return type;
  }
};

export const ownerCashboxLabel = (type: CashboxType): string => {
  switch (type) {
    case 'POS':
      return 'خزينة الكاشير والمتجر';
    case 'Subscriptions':
      return 'خزينة الاستقبال والاشتراكات';
    case 'Main':
      return 'الخزينة الرئيسية';
    default:
      return type;
  }
};

export const ownerTransactionKeys = {
  all: ['owner-transactions'] as const,
  lists: () => [...ownerTransactionKeys.all, 'list'] as const,
  list: (params?: OwnerTransactionQueryParams) => [...ownerTransactionKeys.lists(), params] as const,
  details: () => [...ownerTransactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...ownerTransactionKeys.details(), id] as const,
};

export const ownerTransactionsApi = {
  getAll: async (params?: OwnerTransactionQueryParams): Promise<OwnerTransactionsResponse> => {
    const response = await apiClient.get<OwnerTransactionsResponse>('/api/owner-transactions', {
      params: {
        CashboxType: params?.cashboxType,
        TransactionType: params?.transactionType,
        FromDate: params?.fromDate,
        ToDate: params?.toDate,
        PageNumber: params?.pageNumber ?? 1,
        PageSize: params?.pageSize ?? 20,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<OwnerTransaction> => {
    const response = await apiClient.get<OwnerTransaction>(`/api/owner-transactions/${id}`);
    return response.data;
  },

  create: async (payload: CreateOwnerTransactionPayload): Promise<ApiResponse<OwnerTransaction>> => {
    const response = await apiClient.post<ApiResponse<OwnerTransaction>>('/api/owner-transactions', payload);
    return response.data;
  },
};

