import { apiClient } from '../lib/axios';

// ==========================================
// Shared Pagination Wrapper
// ==========================================

export interface ReportPaginationResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  transactions: T[];
}

export interface ReportDateParams {
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
}

// ==========================================
// 1. Income Report Types
// ==========================================

export interface IncomeReportSummary {
  totalIncome: number;
  totalTransactions: number;
}

export interface IncomeReportSources {
  subscriptionPayments: number;
  productSales: number;
  otherIncome: number;
  ownerDeposits: number;
  externalEntityCollections: number;
}

export interface IncomeTransactionItem {
  transactionId: number;
  transactionDate: string;
  description: string;
  referenceType: string;
  referenceTypeName: string;
  referenceId: number;
  cashboxType: string;
  cashboxName: string;
  amount: number;
  paymentMethod: string | null;
  paymentMethodName: string | null;
  category: string;
  categoryName: string;
  clientName: string | null;
  employeeName: string | null;
  invoiceNumber: string | null;
  payerName: string | null;
}

export interface IncomeReportResponse extends ReportPaginationResponse<IncomeTransactionItem> {
  summary: IncomeReportSummary;
  sources: IncomeReportSources;
}

// ==========================================
// 2. Expense Report Types
// ==========================================

export interface ExpenseReportSummary {
  totalExpenses: number;
  totalTransactions: number;
}

export interface ExpenseReportSources {
  academyExpenses: number;
  saleReturns: number;
  subscriptionCancellations: number;
  purchasePayments: number;
  payrollPayments: number;
  coachPayments: number;
  ownerWithdrawals: number;
  otherExpenses: number;
}

export type ExpenseTransactionItem = IncomeTransactionItem;

export interface ExpenseReportResponse extends ReportPaginationResponse<ExpenseTransactionItem> {
  summary: ExpenseReportSummary;
  sources: ExpenseReportSources;
}

// ==========================================
// 3. Warehouse Report Types
// ==========================================

export interface WarehouseReportSummary {
  totalProducts: number;
  totalCurrentStock: number;
  totalIncoming: number;
  totalOutgoing: number;
  netMovement: number;
  openingStock: number;
  closingStock: number;
}

export interface WarehouseProductItem {
  productId: number;
  productName: string;
  totalIncoming: number;
  totalOutgoing: number;
  netMovement: number;
  currentStock: number;
}

export interface WarehouseTransactionItem {
  transactionId: number;
  productId: number;
  productName: string;
  transactionType: 'In' | 'Out';
  transactionTypeName: string;
  quantity: number;
  transactionDate: string;
  movementGroupId: number;
  description: string;
}

export interface WarehouseReportParams extends ReportDateParams {
  ProductId?: number;
  TransactionType?: 'In' | 'Out' | '';
}

export interface WarehouseReportResponse extends ReportPaginationResponse<WarehouseTransactionItem> {
  summary: WarehouseReportSummary;
  products: WarehouseProductItem[];
}

// ==========================================
// 4. Cashboxes Report Types
// ==========================================

export interface CashboxReportSummary {
  totalCashboxes: number;
  totalCurrentBalance: number;
  totalIncoming: number;
  totalOutgoing: number;
  netMovement: number;
}

export interface CashboxBreakdownItem {
  cashboxType: string;
  cashboxName: string;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  openingBalance: number;
  periodIncoming: number;
  periodOutgoing: number;
  closingBalance: number;
}

export interface CashboxTransactionItem {
  id: number;
  cashboxType: string;
  cashboxName: string;
  transactionType: 'Income' | 'Expense';
  transactionTypeName: string;
  referenceType: string;
  referenceTypeName: string;
  referenceId: number;
  amount: number;
  notes: string;
  transactionDate: string;
}

export interface CashboxReportParams extends ReportDateParams {
  CashboxType?: 'POS' | 'Subscriptions' | 'Main' | '';
  TransactionType?: 'Income' | 'Expense' | '';
  ReferenceType?: string;
}

export interface CashboxReportResponse extends ReportPaginationResponse<CashboxTransactionItem> {
  summary: CashboxReportSummary;
  cashboxes: CashboxBreakdownItem[];
}

// ==========================================
// TanStack Query Keys
// ==========================================

export const reportKeys = {
  all: ['reports'] as const,
  income: (params: ReportDateParams) => [...reportKeys.all, 'income', params] as const,
  expenses: (params: ReportDateParams) => [...reportKeys.all, 'expenses', params] as const,
  warehouse: (params: WarehouseReportParams) => [...reportKeys.all, 'warehouse', params] as const,
  cashboxes: (params: CashboxReportParams) => [...reportKeys.all, 'cashboxes', params] as const,
};

// ==========================================
// Helper: Download File as Blob
// ==========================================

export const downloadReportBlob = async (
  endpoint: string,
  params: Record<string, unknown>,
  defaultFilename: string
): Promise<void> => {
  const cleanParams: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });

  const response = await apiClient.get(endpoint, {
    params: cleanParams,
    responseType: 'blob',
  });

  let filename = defaultFilename;
  const disposition = response.headers['content-disposition'];
  if (disposition) {
    const match = disposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1].replace(/['"]/g, '').trim());
    }
  }

  const contentType = response.headers['content-type'] ? String(response.headers['content-type']) : 'application/octet-stream';
  const blob = new Blob([response.data], {
    type: contentType,
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// ==========================================
// API Services
// ==========================================

export const reportsApi = {
  getIncomeReport: async (params: ReportDateParams): Promise<IncomeReportResponse> => {
    const response = await apiClient.get<IncomeReportResponse>('/api/reports/income', {
      params: {
        FromDate: params.FromDate || undefined,
        ToDate: params.ToDate || undefined,
        PageNumber: params.PageNumber ?? 1,
        PageSize: params.PageSize ?? 20,
      },
    });
    return response.data;
  },

  downloadIncomePdf: (params: ReportDateParams): Promise<void> => {
    return downloadReportBlob('/api/reports/income/pdf', params as Record<string, unknown>, 'IncomeReport.pdf');
  },

  downloadIncomeExcel: (params: ReportDateParams): Promise<void> => {
    return downloadReportBlob('/api/reports/income/excel', params as Record<string, unknown>, 'IncomeReport.xlsx');
  },

  getExpensesReport: async (params: ReportDateParams): Promise<ExpenseReportResponse> => {
    const response = await apiClient.get<ExpenseReportResponse>('/api/reports/expenses', {
      params: {
        FromDate: params.FromDate || undefined,
        ToDate: params.ToDate || undefined,
        PageNumber: params.PageNumber ?? 1,
        PageSize: params.PageSize ?? 20,
      },
    });
    return response.data;
  },

  downloadExpensesPdf: (params: ReportDateParams): Promise<void> => {
    return downloadReportBlob('/api/reports/expenses/pdf', params as Record<string, unknown>, 'ExpensesReport.pdf');
  },

  downloadExpensesExcel: (params: ReportDateParams): Promise<void> => {
    return downloadReportBlob('/api/reports/expenses/excel', params as Record<string, unknown>, 'ExpensesReport.xlsx');
  },

  getWarehouseReport: async (params: WarehouseReportParams): Promise<WarehouseReportResponse> => {
    const response = await apiClient.get<WarehouseReportResponse>('/api/reports/warehouse', {
      params: {
        FromDate: params.FromDate || undefined,
        ToDate: params.ToDate || undefined,
        ProductId: params.ProductId || undefined,
        TransactionType: params.TransactionType || undefined,
        PageNumber: params.PageNumber ?? 1,
        PageSize: params.PageSize ?? 20,
      },
    });
    return response.data;
  },

  downloadWarehousePdf: (params: WarehouseReportParams): Promise<void> => {
    return downloadReportBlob('/api/reports/warehouse/pdf', params as Record<string, unknown>, 'WarehouseReport.pdf');
  },

  downloadWarehouseExcel: (params: WarehouseReportParams): Promise<void> => {
    return downloadReportBlob('/api/reports/warehouse/excel', params as Record<string, unknown>, 'WarehouseReport.xlsx');
  },

  getCashboxesReport: async (params: CashboxReportParams): Promise<CashboxReportResponse> => {
    const response = await apiClient.get<CashboxReportResponse>('/api/reports/cashboxes', {
      params: {
        FromDate: params.FromDate || undefined,
        ToDate: params.ToDate || undefined,
        CashboxType: params.CashboxType || undefined,
        TransactionType: params.TransactionType || undefined,
        ReferenceType: params.ReferenceType || undefined,
        PageNumber: params.PageNumber ?? 1,
        PageSize: params.PageSize ?? 20,
      },
    });
    return response.data;
  },

  downloadCashboxesPdf: (params: CashboxReportParams): Promise<void> => {
    return downloadReportBlob('/api/reports/cashboxes/pdf', params as Record<string, unknown>, 'CashboxesReport.pdf');
  },

  downloadCashboxesExcel: (params: CashboxReportParams): Promise<void> => {
    return downloadReportBlob('/api/reports/cashboxes/excel', params as Record<string, unknown>, 'CashboxesReport.xlsx');
  },
};
