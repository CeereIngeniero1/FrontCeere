import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../types/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          if (error.isUnauthorized || error.status === 403 || error.status === 404) {
            return false
          }
          if (error.isNetworkError) {
            return failureCount < 2
          }
        }
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

export const queryKeys = {
  health: ['health'] as const,
  dashboard: {
    personal: ['dashboard', 'personal'] as const,
    team: ['dashboard', 'team'] as const,
  },
}
