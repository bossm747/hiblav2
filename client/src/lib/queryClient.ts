import { QueryClient } from '@tanstack/react-query';

// Create a reusable fetch function for API requests
async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const [url] = queryKey as string[];
        return apiRequest(url);
      },
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 0, // Always consider data stale for real-time updates
    },
  },
});

export { apiRequest };