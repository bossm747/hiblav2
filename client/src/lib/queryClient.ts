import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Get the API base URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;

  // Get token from localStorage or window
  const token = localStorage.getItem('auth_token') || (window as any).authToken;
  
  // Build headers with Authorization if token exists
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge with existing headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(fullUrl, {
    headers,
    credentials: 'include', // Include cookies for session management
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.status} - ${errorText}`);
    
    // If 401 unauthorized, clear auth and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}