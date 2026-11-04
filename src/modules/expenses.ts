import { apiClient } from '../lib/axios';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export type CashboxType = 'Main' | 'POS';

// --- Expenses Types ---

export interface Expense {
  id: number;
  amount: number;
  expenseDate: string;
  description: string;
  cashboxType: CashboxType;
  createdAt: string;
}

export interface ExpenseListResponse {
  items: Expense[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateExpensePayload {
  amount: number;
  expenseDate: string;
  description: string;
  cashboxType?: CashboxType;
}

export interface UpdateExpensePayload {
  amount: number;
  expenseDate: string;
  description: string;
  cashboxType?: CashboxType;
}

export interface ExpenseQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  cashboxType?: string;
}

// --- Other Incomes Types ---

export interface OtherIncome {
  id: number;
  amount: number;
  incomeDate: string;
  description: string;
  cashboxType?: CashboxType;
}

export interface OtherIncomeListResponse {
  items: OtherIncome[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateOtherIncomePayload {
  amount: number;
  incomeDate: string;
  description: string;
}

export interface UpdateOtherIncomePayload {
  amount: number;
  incomeDate: string;
  description: string;
}

export interface OtherIncomeQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// --- Query Keys ---

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (params?: ExpenseQueryParams) => [...expenseKeys.lists(), params] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: number) => [...expenseKeys.details(), id] as const,
};

export const otherIncomeKeys = {
  all: ['other-incomes'] as const,
  lists: () => [...otherIncomeKeys.all, 'list'] as const,
  list: (params?: OtherIncomeQueryParams) => [...otherIncomeKeys.lists(), params] as const,
  details: () => [...otherIncomeKeys.all, 'detail'] as const,
  detail: (id: number) => [...otherIncomeKeys.details(), id] as const,
};

// --- Expenses API ---

export const expensesApi = {
  getAll: async (params?: ExpenseQueryParams): Promise<ExpenseListResponse> => {
    const res = await apiClient.get<ExpenseListResponse>('/api/expenses', {
      params: {
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 15,
        Search: params?.search || undefined,
        CashboxType: params?.cashboxType || undefined,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<Expense> => {
    const res = await apiClient.get<Expense>(`/api/expenses/${id}`);
    return res.data;
  },

  create: async (payload: CreateExpensePayload): Promise<ApiResponse<Expense>> => {
    const body = {
      ...payload,
      cashboxType: payload.cashboxType || 'Main',
    };
    const res = await apiClient.post<ApiResponse<Expense>>('/api/expenses', body);
    return res.data;
  },

  update: async (id: number, payload: UpdateExpensePayload): Promise<ApiResponse<Expense>> => {
    const body = {
      ...payload,
      cashboxType: payload.cashboxType || 'Main',
    };
    const res = await apiClient.put<ApiResponse<Expense>>(`/api/expenses/${id}`, body);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await apiClient.delete<ApiResponse<Record<string, unknown>>>(`/api/expenses/${id}`);
    return res.data;
  },
};

// --- Other Incomes API ---

export const otherIncomesApi = {
  getAll: async (params?: OtherIncomeQueryParams): Promise<OtherIncomeListResponse> => {
    const res = await apiClient.get<OtherIncomeListResponse>('/api/other-incomes', {
      params: {
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 15,
        Search: params?.search || undefined,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<OtherIncome> => {
    const res = await apiClient.get<OtherIncome>(`/api/other-incomes/${id}`);
    return res.data;
  },

  create: async (payload: CreateOtherIncomePayload): Promise<ApiResponse<OtherIncome>> => {
    const res = await apiClient.post<ApiResponse<OtherIncome>>('/api/other-incomes', payload);
    return res.data;
  },

  update: async (id: number, payload: UpdateOtherIncomePayload): Promise<ApiResponse<OtherIncome>> => {
    const res = await apiClient.put<ApiResponse<OtherIncome>>(`/api/other-incomes/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await apiClient.delete<ApiResponse<Record<string, unknown>>>(`/api/other-incomes/${id}`);
    return res.data;
  },
};

