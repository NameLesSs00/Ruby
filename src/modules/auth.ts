import { apiClient, setStoredTokens } from '../lib/axios';

/**
 * Authentication & Authorization Types & Services
 * Based on backend endpoints in backendMD/auth.md
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export type UserRole = 'SuperAdmin' | 'ReceptionAdmin' | 'ShopAdmin' | 'Admin' | 'Coach' | 'Receptionist';

export const ADMIN_ROLES = ['SuperAdmin', 'Admin'];
export const POS_ROLES = ['SuperAdmin', 'Admin', 'ShopAdmin'];
export const RECEPTION_ROLES = ['SuperAdmin', 'Admin', 'ReceptionAdmin'];

export interface AllowedPageSection {
  path: string;
  label: string;
  description: string;
}

export function isSuperAdminRole(role?: string): boolean {
  return role === 'SuperAdmin' || role === 'Admin';
}

export function getRoleDisplayName(role?: string): string {
  switch (role) {
    case 'SuperAdmin':
    case 'Admin':
      return 'مدير عام النظام (SuperAdmin)';
    case 'ReceptionAdmin':
      return 'مسؤول الاستقبال والاشتراكات (ReceptionAdmin)';
    case 'ShopAdmin':
      return 'مسؤول نقطة البيع (POS)';
    default:
      return role || 'مستخدم النظام';
  }
}

export function getDefaultRouteForRole(role?: string): string {
  if (role === 'ShopAdmin') return '/pos';
  if (role === 'ReceptionAdmin') return '/subscriptions';
  return '/dashboard';
}

export function getAllowedPagesForRole(role?: string): AllowedPageSection[] {
  if (role === 'ShopAdmin') {
    return [
      {
        path: '/pos',
        label: 'شاشة الكاشير (نقطة البيع)',
        description: 'إصدار فواتير المبيعات وإدارة الفواتير المفتوحة',
      },
      {
        path: '/pos/sales',
        label: 'سجل المبيعات',
        description: 'استعراض وطباعة فواتير مبيعات المتجر',
      },
      {
        path: '/pos/returns',
        label: 'مرتجعات المبيعات',
        description: 'تسجيل ومراجعة مرتجعات فواتير نقاط البيع',
      },
      {
        path: '/pos/due-payments',
        label: 'ديون ومستحقات الكاشير',
        description: 'متابعة وتحصيل المبالغ المتبقية على فواتير البيع',
      },
    ];
  }

  if (role === 'ReceptionAdmin') {
    return [
      {
        path: '/subscriptions',
        label: 'الاشتراكات وتحصيل الدفعات',
        description: 'إدارة الاشتراكات، تحصيل مدفوعات وديون الاشتراكات، وتعيين المدربين',
      },
      {
        path: '/clients',
        label: 'دليل العملاء والسباحين',
        description: 'عرض وإضافة وتعديل بيانات المشتركين والسباحين',
      },
      {
        path: '/attendance',
        label: 'تسجيل الحضور والانصراف',
        description: 'تسجيل حضور السباحين والاشتراكات بالباركود أو الاسم',
      },
      {
        path: '/coaches',
        label: 'دليل المدربين',
        description: 'عرض قائمة الكادر التدريبي وإضافة أو تعديل بيانات المدربين',
      },
    ];
  }

  return [
    {
      path: '/dashboard',
      label: 'لوحة التحكم الرئيسية',
      description: 'نظرة شاملة على مؤشرات الأكاديمية والوصول لكافة الأقسام',
    },
    {
      path: '/pos',
      label: 'نقطة البيع (POS)',
      description: 'شاشة الكاشير وإدارة المبيعات والمرتجعات',
    },
    {
      path: '/subscriptions',
      label: 'إدارة الاشتراكات',
      description: 'متابعة اشتراكات السباحين والمدفوعات',
    },
    {
      path: '/clients',
      label: 'العملاء والسباحين',
      description: 'إدارة ملفات المشتركين والباركود',
    },
  ];
}

export interface DecodedUser {
  id: string;
  name: string;
  role: UserRole | string;
  email?: string;
  exp?: number;
  iat?: number;
}

export interface AuthState {
  user: DecodedUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function decodeJwt(token: string): DecodedUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || parsed.sub || '',
      name: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || parsed.name || '',
      role: parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || parsed.role || 'Admin',
      email: parsed.email,
      exp: parsed.exp,
      iat: parsed.iat,
    };
  } catch {
    return null;
  }
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/api/auth/login', payload);
    setStoredTokens(response.data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/api/auth/refresh', { refreshToken });
    setStoredTokens(response.data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    try {
      await apiClient.post('/api/auth/logout', { refreshToken });
    } finally {
      setStoredTokens(null);
    }
  },
};
