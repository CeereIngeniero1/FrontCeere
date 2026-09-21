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
  tasks: {
    all: ['tasks'] as const,
    list: ['tasks', 'list'] as const,
  },
  time: {
    all: ['time'] as const,
    summary: ['time', 'summary'] as const,
    entries: ['time', 'entries'] as const,
  },
  dailyReports: {
    all: ['daily-reports'] as const,
    today: ['daily-reports', 'today'] as const,
    mine: ['daily-reports', 'me'] as const,
    team: ['daily-reports', 'team'] as const,
  },
  calendar: {
    all: ['calendar'] as const,
    list: ['calendar', 'list'] as const,
  },
  users: {
    all: ['users'] as const,
    list: ['users', 'list'] as const,
  },
  team: {
    all: ['team'] as const,
    members: ['team', 'members'] as const,
  },
  reports: {
    all: ['reports'] as const,
    summary: ['reports', 'summary'] as const,
  },
}
