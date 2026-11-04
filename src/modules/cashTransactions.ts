import { apiClient } from '../lib/axios';

/**
 * Cash Transactions & Treasury (الخزينة وحسابات النقدية) Domain Models & API Services
 * Based on backendMD/CashTransactions.md
 */

export type CashboxType = 'POS' | 'Subscriptions' | 'Main';

export type CashTransactionType = 'Income' | 'Expense';

export type CashReferenceType =
  | 'Subscription'
  | 'Sale'
  | 'Payroll'
  | 'Expense'
  | 'SubscriptionCancellation'
  | 'SaleReturn'
  | 'OtherIncome'
  | 'DuePaymentCollection'
  | 'CoachPayment'
  | 'PurchaseInvoicePayment'
  | 'CashTransfer';

export interface CashboxBalance {
  cashboxType: CashboxType;
  cashboxName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CashTransaction {
  id: number;
  cashboxType: CashboxType;
  cashboxName: string;
  transactionType: CashTransactionType;
  transactionTypeName: string;
  amount: number;
  transactionDate: string; // ISO date-time
  referenceType: CashReferenceType;
  referenceTypeName: string;
  referenceId: number;
  notes?: string | null;
  isVoided: boolean;
  voidedAt?: string | null;
}

export interface CashTransactionsResponse {
  items: CashTransaction[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CashTransactionQueryParams {
  cashboxType?: CashboxType;
  transactionType?: CashTransactionType;
  referenceType?: CashReferenceType;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
  pageNumber?: number;
  pageSize?: number;
}

export interface CashTransfer {
  id: number;
  fromCashboxType: CashboxType;
  toCashboxType: CashboxType;
  amount: number;
  transferDate: string; // ISO date-time
  notes?: string | null;
}

export interface CashTransfersResponse {
  items: CashTransfer[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateCashTransferPayload {
  fromCashboxType: CashboxType;
  toCashboxType: CashboxType;
  amount: number;
  notes?: string;
}

export interface CashTransferQueryParams {
  fromCashboxType?: CashboxType;
  toCashboxType?: CashboxType;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const cashboxLabel = (type: CashboxType): string => {
  switch (type) {
    case 'Main':
      return 'الخزينة الرئيسية';
    case 'Subscriptions':
      return 'خزينة الاشتراكات';
    case 'POS':
      return 'خزينة المتجر / نقاط البيع';
    default:
      return type;
  }
};

export const referenceTypeLabel = (ref: CashReferenceType): string => {
  switch (ref) {
    case 'Subscription':
      return 'اشتراك';
    case 'Sale':
      return 'مبيعات المتجر';
    case 'Payroll':
      return 'رواتب الموظفين';
    case 'Expense':
      return 'مصروف تشغيلي';
    case 'SubscriptionCancellation':
      return 'استرداد إلغاء اشتراك';
    case 'SaleReturn':
      return 'مرتجع مبيعات';
    case 'OtherIncome':
      return 'إيراد إضافي';
    case 'DuePaymentCollection':
      return 'تحصيل دين / مستحق';
    case 'CoachPayment':
      return 'صرف مستحقات / سلفة مدرب';
    case 'PurchaseInvoicePayment':
      return 'سداد فاتورة مشتريات';
    case 'CashTransfer':
      return 'تحويل نقدية بين الخزن';
    default:
      return ref;
  }
};

export const cashTransactionKeys = {
  all: ['cash-transactions'] as const,
  balances: () => [...cashTransactionKeys.all, 'balances'] as const,
  lists: () => [...cashTransactionKeys.all, 'list'] as const,
  list: (params?: CashTransactionQueryParams) => [...cashTransactionKeys.lists(), params] as const,
};

export const cashTransferKeys = {
  all: ['cash-transfers'] as const,
  lists: () => [...cashTransferKeys.all, 'list'] as const,
  list: (params?: CashTransferQueryParams) => [...cashTransferKeys.lists(), params] as const,
};

export const cashTransactionsApi = {
  getBalances: async (): Promise<CashboxBalance[]> => {
    const response = await apiClient.get<CashboxBalance[]>('/api/cash-transactions/balances');
    return response.data;
  },

  getAll: async (params?: CashTransactionQueryParams): Promise<CashTransactionsResponse> => {
    const response = await apiClient.get<CashTransactionsResponse>('/api/cash-transactions', {
      params: {
        CashboxType: params?.cashboxType,
        TransactionType: params?.transactionType,
        ReferenceType: params?.referenceType,
        FromDate: params?.fromDate,
        ToDate: params?.toDate,
        PageNumber: params?.pageNumber ?? 1,
        PageSize: params?.pageSize ?? 20,
      },
    });
    return response.data;
  },
};

export const cashTransfersApi = {
  getAll: async (params?: CashTransferQueryParams): Promise<CashTransfersResponse> => {
    const response = await apiClient.get<CashTransfersResponse>('/api/cash-transfers', {
      params: {
        FromCashboxType: params?.fromCashboxType,
        ToCashboxType: params?.toCashboxType,
        FromDate: params?.fromDate,
        ToDate: params?.toDate,
        PageNumber: params?.pageNumber ?? 1,
        PageSize: params?.pageSize ?? 20,
      },
    });
    return response.data;
  },

  create: async (payload: CreateCashTransferPayload): Promise<ApiResponse<CashTransfer>> => {
    const response = await apiClient.post<ApiResponse<CashTransfer>>('/api/cash-transfers', payload);
    return response.data;
  },
};

