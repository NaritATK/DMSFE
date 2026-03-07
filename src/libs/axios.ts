import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Use FE internal API as single gateway (Browser -> /api/* -> DMFAPI)
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const safeGetBackendToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  const storedToken = localStorage.getItem('backendToken');

  if (storedToken) return storedToken;

  const session = await getSession().catch(() => null);
  const sessionBackendToken = (session as any)?.backendToken;

  if (sessionBackendToken) {
    localStorage.setItem('backendToken', sessionBackendToken);

    return sessionBackendToken;
  }

  return null;
};

const getLocaleFromPathname = (pathname: string): string => {
  const pathParts = pathname.split('/').filter(Boolean);
  const maybeLocale = pathParts[0];

  return maybeLocale && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(maybeLocale) ? maybeLocale : 'en';
};

const getNormalizedErrorMessage = (error: any): string => {
  const backendMessage = error?.response?.data?.message
    || error?.response?.data?.error
    || error?.response?.data?.detail;

  if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  if (error?.response?.status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  return error?.message || 'Request failed. Please try again.';
};

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const backendToken = await safeGetBackendToken();

    if (backendToken) {
      config.headers.Authorization = `Bearer ${backendToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
let isRedirecting = false;

const noForceRedirectPaths = ['/user-roles/switch', '/user-roles/users', '/user-roles/roles'];
const protectedSegments = ['dashboard', 'upload', 'edit', 'history', 'admin'];

const isProtectedPath = (pathname: string) => {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length === 0) return false;

  const hasLocalePrefix = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(segments[0]);
  const targetSegment = hasLocalePrefix ? segments[1] : segments[0];

  return !!targetSegment && protectedSegments.includes(targetSegment);
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || '');

    // Handle 401 - redirect to login immediately
    if (status === 401 && !isRedirecting && typeof window !== 'undefined') {
      // Skip redirect for role-management endpoints
      const shouldSkipRedirect = noForceRedirectPaths.some(path => requestUrl.includes(path));
      
      if (!shouldSkipRedirect) {
        isRedirecting = true;
        const pathname = window.location.pathname;
        const locale = getLocaleFromPathname(pathname);
        
        // Clear stored token
        localStorage.removeItem('backendToken');
        
        // Build redirect URL
        const currentPathWithQuery = `${pathname}${window.location.search || ''}`;
        const loginUrl = `/${locale}/login?error=session_expired&redirectTo=${encodeURIComponent(currentPathWithQuery)}`;
        
        console.log('[axios] 401 detected, redirecting to:', loginUrl);
        
        // Force redirect immediately
        window.location.replace(loginUrl);
        
        // Return a never-resolving promise to stop further processing
        return new Promise(() => {});
      }
    }

    (error as any).message = getNormalizedErrorMessage(error);

    return Promise.reject(error);
  }
);

export default apiClient;
