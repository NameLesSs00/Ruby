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
