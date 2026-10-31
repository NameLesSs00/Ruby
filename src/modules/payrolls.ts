import { apiClient } from '../lib/axios';

/**
 * Payroll Adjustments & Payrolls Domain Models & API Services
 * Based on backendMD/PayrollAdjustments.md
 */

// ─── Bonuses ────────────────────────────────────────────────────────────────

export interface Bonus {
  id: number;
  employeeId: number;
  amount: number;
  bonusDate: string;    // ISO datetime
  payrollMonth: string; // YYYY-MM-DD
  description: string;
}

export interface CreateBonusPayload {
  employeeId: number;
  payrollMonth: string; // "YYYY-MM-DD" (first day of month)
  amount: number;
  description: string;
}

export interface BonusFilterParams {
  employeeId?: number;
  payrollMonth?: string;
  from?: string;
  to?: string;
}

// ─── Deductions ─────────────────────────────────────────────────────────────

export interface Deduction {
  id: number;
  employeeId: number;
  amount: number;
  deductionDate: string; // ISO datetime
  payrollMonth: string;  // YYYY-MM-DD
  description: string;
}

export interface CreateDeductionPayload {
  employeeId: number;
  payrollMonth: string;
  amount: number;
  description: string;
}

export interface DeductionFilterParams {
  employeeId?: number;
  payrollMonth?: string;
  from?: string;
  to?: string;
}

// ─── Payrolls ────────────────────────────────────────────────────────────────

/** 1 = غير مدفوع | 2 = مدفوع جزئياً | 3 = مدفوع بالكامل */
export type PaymentStatus = 1 | 2 | 3;

export interface PayrollRecord {
  id: number;
  employeeId: number;
  payrollMonth: string;
  salaryAmount: number;
  bonusAmount: number;
  deductionAmount: number;
  netSalary: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  notes: string;
}

export interface CreatePayrollPayload {
  employeeId: number;
  payrollMonth: string; // "YYYY-MM-DD" (first day of month)
  notes?: string;
}

export interface UpdatePayrollPayload {
  notes: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

// ─── Payroll Payments ────────────────────────────────────────────────────────

export interface PayrollPayment {
  id: number;
  payrollId: number;
  amountPaid: number;
  paymentDate: string;
  cashboxId: number;
}

export interface RecordPaymentPayload {
  payrollId: number;
  amountPaid: number;
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const payrollKeys = {
  all: ['payrolls'] as const,
  lists: () => [...payrollKeys.all, 'list'] as const,
  detail: (id: number) => [...payrollKeys.all, 'detail', id] as const,
  bonuses: (params?: BonusFilterParams) => ['bonuses', params] as const,
  deductions: (params?: DeductionFilterParams) => ['deductions', params] as const,
  payments: () => ['payroll-payments'] as const,
  paymentsByPayroll: (payrollId: number) => ['payroll-payments', 'payroll', payrollId] as const,
};

// ─── API Functions ───────────────────────────────────────────────────────────

export const payrollsApi = {
  /** GET /api/payrolls */
  getAll: async (): Promise<PayrollRecord[]> => {
    const res = await apiClient.get<PayrollRecord[]>('/api/payrolls');
    return res.data;
  },

  /** GET /api/payrolls/:id */
  getById: async (id: number): Promise<PayrollRecord> => {
    const res = await apiClient.get<PayrollRecord>(`/api/payrolls/${id}`);
    return res.data;
  },

  /** POST /api/payrolls */
  create: async (payload: CreatePayrollPayload): Promise<ApiResponse<PayrollRecord>> => {
    const res = await apiClient.post<ApiResponse<PayrollRecord>>('/api/payrolls', payload);
    return res.data;
  },

  /** PUT /api/payrolls/:id */
  update: async (id: number, payload: UpdatePayrollPayload): Promise<ApiResponse<PayrollRecord>> => {
    const res = await apiClient.put<ApiResponse<PayrollRecord>>(`/api/payrolls/${id}`, payload);
    return res.data;
  },

  /** DELETE /api/payrolls/:id */
  delete: async (id: number): Promise<ApiResponse<PayrollRecord>> => {
    const res = await apiClient.delete<ApiResponse<PayrollRecord>>(`/api/payrolls/${id}`);
    return res.data;
  },
};

export const bonusesApi = {
  /** GET /api/payroll-adjustments/bonuses */
  getAll: async (params?: BonusFilterParams): Promise<Bonus[]> => {
    const res = await apiClient.get<Bonus[]>('/api/payroll-adjustments/bonuses', {
      params: {
        employeeId: params?.employeeId || undefined,
        payrollMonth: params?.payrollMonth || undefined,
        from: params?.from || undefined,
        to: params?.to || undefined,
      },
    });
    return res.data;
  },

  /** POST /api/payroll-adjustments/bonuses */
  create: async (payload: CreateBonusPayload): Promise<ApiResponse<Bonus>> => {
    const res = await apiClient.post<ApiResponse<Bonus>>('/api/payroll-adjustments/bonuses', payload);
    return res.data;
  },
};

export const deductionsApi = {
  /** GET /api/payroll-adjustments/deductions */
  getAll: async (params?: DeductionFilterParams): Promise<Deduction[]> => {
    const res = await apiClient.get<Deduction[]>('/api/payroll-adjustments/deductions', {
      params: {
        employeeId: params?.employeeId || undefined,
        payrollMonth: params?.payrollMonth || undefined,
        from: params?.from || undefined,
        to: params?.to || undefined,
      },
    });
    return res.data;
  },

  /** POST /api/payroll-adjustments/deductions */
  create: async (payload: CreateDeductionPayload): Promise<ApiResponse<Deduction>> => {
    const res = await apiClient.post<ApiResponse<Deduction>>('/api/payroll-adjustments/deductions', payload);
    return res.data;
  },
};

export const payrollPaymentsApi = {
  /** GET /api/payroll-payments */
  getAll: async (): Promise<PayrollPayment[]> => {
    const res = await apiClient.get<PayrollPayment[]>('/api/payroll-payments');
    return res.data;
  },

  /** GET /api/payroll-payments/payroll/:payrollId */
  getByPayrollId: async (payrollId: number): Promise<PayrollPayment[]> => {
    const res = await apiClient.get<PayrollPayment[]>(`/api/payroll-payments/payroll/${payrollId}`);
    return res.data;
  },

  /** POST /api/payroll-payments/record-payment */
  recordPayment: async (payload: RecordPaymentPayload): Promise<ApiResponse<PayrollPayment>> => {
    const res = await apiClient.post<ApiResponse<PayrollPayment>>('/api/payroll-payments/record-payment', payload);
    return res.data;
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts <input type="month"> value "YYYY-MM" to "YYYY-MM-01" for the API */
export function monthInputToApiDate(monthValue: string): string {
  return `${monthValue}-01`;
}

/** Formats paymentStatus number to Arabic label */
export function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 1: return 'غير مدفوع';
    case 2: return 'مدفوع جزئياً';
    case 3: return 'مدفوع بالكامل';
  }
}

/** Returns CSS class suffix for paymentStatus badge */
export function paymentStatusClass(status: PaymentStatus): string {
  switch (status) {
    case 1: return 'inactive';   // red
    case 2: return 'partial';    // yellow/orange
    case 3: return 'active';     // green
  }
}

