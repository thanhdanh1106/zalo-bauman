// src/services/authService.ts
import { getCookie, setCookie, deleteCookie } from '@shared/utils/Hooks';
import axios from 'axios';

// Interface cho User
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Interface cho Login Response
interface LoginResponse {
  li_at: string;
  token_type: string;
  expires_in: number;
  user: User;
}

/**
 * Get current tenant name from localStorage or URL
 */
export const getCurrentTenantName = (): string | null => {
  // Try to get from localStorage first
  const storedTenant = localStorage.getItem('current_tenant');
  const standardRoutes = ['login', 'register', 'reset-password', 'new-password', 'terms', 'privacy', 'admin'];

  if (storedTenant && !standardRoutes.includes(storedTenant)) {
    return storedTenant;
  }

  // Try to extract from current URL path
  const pathSegments = window.location.pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0 && !standardRoutes.includes(pathSegments[0])) {
    return pathSegments[0];
  }

  return null;
};

const buildApiUrl = (): string => {
  let baseUrl = (import.meta as any).env?.VITE_API_URL || 'https://miniapp.test';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`;
  }
  return baseUrl;
};

// API Client cho các request đến Laravel Backend
export const apiClient = axios.create({
  baseURL: buildApiUrl(),
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': undefined,
  },
});

// Update baseURL when tenant changes
export const updateApiClientBaseUrl = () => {
  apiClient.defaults.baseURL = buildApiUrl();
};

apiClient.interceptors.response.use(
  r => r,
  err => {
    console.error("AXIOS ERROR:", err.message, err.config?.url);
    return Promise.reject(err);
  }
);

// Interceptor để thêm Authorization header và Tenant header
apiClient.interceptors.request.use(
  (config) => {
    // Update baseURL dynamically for each request
    config.baseURL = buildApiUrl();

    // Add Authorization header
    const token = getCookie('li_at') || localStorage.getItem('li_at');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Tenant header
    const tenantName = getCurrentTenantName();
    if (tenantName) {
      config.headers['X-Tenant'] = tenantName;
    }

    return config;
  },
  (error) => {
    console.error("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("RESPONSE ERROR:", error);
    if (error.response?.status === 401) {
      // Xóa token và redirect về login
      // deleteCookie('li_at');
      localStorage.removeItem('li_at');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Các hàm authentication
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const { li_at, user } = response.data;

    // Lưu token và user info
    setCookie('li_at', li_at, 15); // 15 ngày
    localStorage.setItem('li_at', li_at);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string, password_confirmation: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });

    const { li_at, user } = response.data;

    // Lưu token và user info
    setCookie('li_at', li_at, 15); // 15 ngày
    localStorage.setItem('li_at', li_at);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await apiClient.post('/auth/logout');
    if (response && !response.error) {
      deleteCookie('li_at');
      localStorage.removeItem('li_at');
      localStorage.removeItem('user');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await apiClient.get<{ user: User }>('/auth/user');
    const user = response.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getCookie('li_at') || localStorage.getItem('li_at');
  return !!token;
};
