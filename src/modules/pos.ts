import { apiClient } from '../lib/axios';

/**
 * Point of Sale (POS), Sales, Returns & Due Payments Domain Models & API Services
 * Based on backendMD/paymentPOS.md
 */

export * from './posReturns';

// ==========================================
// Sales Types
// ==========================================

export type SaleStatus = 'NotReturned' | 'PartiallyReturned' | 'FullyReturned';

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SaleRecord {
  id: number;
  invoiceNumber: string;
  saleDate: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: SaleStatus;
  notes?: string | null;
  items: SaleItem[];
}

export interface SaleListResponse {
  items: SaleRecord[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface CreateSaleItemPayload {
  productId: number;
  quantity: number;
}

export interface CreateSalePayload {
  items: CreateSaleItemPayload[];
  discountAmount: number;
  amountPaid: number;
  payerName?: string | null;
  debtDescription?: string | null;
  dueDate?: string | null;
  notes?: string | null;
}

export interface SaleQueryParams {
  status?: SaleStatus | '';
  page?: number;
  pageSize?: number;
}

// ==========================================
// POS Due Payments Types
// ==========================================

export type DuePaymentStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid';

export interface PosDuePayment {
  id: number;
  saleId: number;
  payerName: string;
  description?: string | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate?: string | null;
  status: DuePaymentStatus;
  createdAt: string;
}

export interface PosDuePaymentListResponse {
  items: PosDuePayment[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface DuePaymentQueryParams {
  status?: DuePaymentStatus | '';
  saleId?: number;
  page?: number;
  pageSize?: number;
}

export interface RecordPosPaymentPayload {
  duePaymentId: number;
  amountPaid: number;
}

export interface PosPaymentHistoryItem {
  id: number;
  duePaymentId: number;
  saleId: number;
  payerName: string;
  amountPaid: number;
  paymentDate: string;
  cashboxId: number;
  cashboxName?: string;
}

export interface PosPaymentHistoryResponse {
  items: PosPaymentHistoryItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface PosPaymentHistoryQueryParams {
  duePaymentId?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const posKeys = {
  sales: {
    all: ['pos-sales'] as const,
    lists: () => [...posKeys.sales.all, 'list'] as const,
    list: (params: SaleQueryParams) => [...posKeys.sales.lists(), params] as const,
    details: () => [...posKeys.sales.all, 'detail'] as const,
    detail: (id: number) => [...posKeys.sales.details(), id] as const,
  },
  returns: {
    all: ['pos-returns'] as const,
    lists: () => [...posKeys.returns.all, 'list'] as const,
    details: () => [...posKeys.returns.all, 'detail'] as const,
    detail: (id: number) => [...posKeys.returns.details(), id] as const,
  },
  duePayments: {
    all: ['pos-due-payments'] as const,
    lists: () => [...posKeys.duePayments.all, 'list'] as const,
    list: (params: DuePaymentQueryParams) => [...posKeys.duePayments.lists(), params] as const,
    details: () => [...posKeys.duePayments.all, 'detail'] as const,
    detail: (id: number) => [...posKeys.duePayments.details(), id] as const,
    histories: () => [...posKeys.duePayments.all, 'history'] as const,
    history: (params: PosPaymentHistoryQueryParams) => [...posKeys.duePayments.histories(), params] as const,
  },
};

// ==========================================
// API Services
// ==========================================

export const posSalesApi = {
  getAll: async (params: SaleQueryParams): Promise<SaleListResponse> => {
    const response = await apiClient.get<SaleListResponse>('/api/sales', {
      params: {
        Status: params.status || undefined,
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 20,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<SaleRecord> => {
    const response = await apiClient.get<SaleRecord>(`/api/sales/${id}`);
    return response.data;
  },

  create: async (payload: CreateSalePayload): Promise<ApiResponse<SaleRecord>> => {
    const response = await apiClient.post<ApiResponse<SaleRecord>>('/api/sales', payload);
    return response.data;
  },
};

export const posDuePaymentsApi = {
  getAll: async (params: DuePaymentQueryParams): Promise<PosDuePaymentListResponse> => {
    const response = await apiClient.get<PosDuePaymentListResponse>('/api/pos-due-payments', {
      params: {
        status: params.status || undefined,
        saleId: params.saleId || undefined,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<PosDuePayment> => {
    const response = await apiClient.get<PosDuePayment>(`/api/pos-due-payments/${id}`);
    return response.data;
  },

  recordPayment: async (payload: RecordPosPaymentPayload): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>('/api/pos-due-payments/record-payment', payload);
    return response.data;
  },

  getPaymentHistory: async (params: PosPaymentHistoryQueryParams): Promise<PosPaymentHistoryResponse> => {
    const response = await apiClient.get<PosPaymentHistoryResponse>('/api/pos-due-payments/payment-history', {
      params: {
        duePaymentId: params.duePaymentId || undefined,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
      },
    });
    return response.data;
  },
};
