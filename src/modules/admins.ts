import { apiClient } from '../lib/axios';

/**
 * Admins & Roles Management Types and Services
 * Based on backend endpoints in backendMD/admins.md
 */

export type AdminRole = 'SuperAdmin' | 'ReceptionAdmin' | 'ShopAdmin';
export type CreatableAdminRole = 'ReceptionAdmin' | 'ShopAdmin';

export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  role: AdminRole;
  isDeactivated: boolean;
}

export interface CreateAdminPayload {
  userName: string;
  email: string;
  password: string;
  role: CreatableAdminRole;
}

export interface UpdateAdminPayload {
  userName: string;
  email: string;
}

export interface ResetAdminPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAdminStatusPayload {
  isDeactivated: boolean;
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const adminKeys = {
  all: ['admins'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
  detail: (id: string) => [...adminKeys.all, 'detail', id] as const,
};

// ─── API Functions ───────────────────────────────────────────────────────────

export const adminsApi = {
  /** GET /api/admins */
  getAll: async (): Promise<AdminUser[]> => {
    const res = await apiClient.get<AdminUser[]>('/api/admins');
    return res.data;
  },

  /** GET /api/admins/:id */
  getById: async (id: string): Promise<AdminUser> => {
    const res = await apiClient.get<AdminUser>(`/api/admins/${id}`);
    return res.data;
  },

  /** POST /api/admins */
  create: async (payload: CreateAdminPayload): Promise<AdminUser> => {
    const res = await apiClient.post<AdminUser>('/api/admins', payload);
    return res.data;
  },

  /** PUT /api/admins/:id */
  update: async (id: string, payload: UpdateAdminPayload): Promise<AdminUser> => {
    const res = await apiClient.put<AdminUser>(`/api/admins/${id}`, payload);
    return res.data;
  },

  /** PUT /api/admins/:id/password */
  resetPassword: async (id: string, payload: ResetAdminPasswordPayload): Promise<void> => {
    await apiClient.put(`/api/admins/${id}/password`, payload);
  },

  /** PUT /api/admins/:id/status */
  updateStatus: async (id: string, payload: UpdateAdminStatusPayload): Promise<AdminUser> => {
    const res = await apiClient.put<AdminUser>(`/api/admins/${id}/status`, payload);
    return res.data;
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getRoleBadgeInfo(role: AdminRole): { label: string; bg: string; color: string } {
  switch (role) {
    case 'SuperAdmin':
      return { label: 'مدير عام النظام', bg: '#0D1527', color: '#f8fafc' };
    case 'ReceptionAdmin':
      return { label: 'مسؤول الاستقبال', bg: '#e0f2fe', color: '#0284c7' };
    case 'ShopAdmin':
      return { label: 'مسؤول المتجر', bg: '#ffedd5', color: '#ea580c' };
    default:
      return { label: role, bg: '#f1f5f9', color: '#475569' };
  }
}

