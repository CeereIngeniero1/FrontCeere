import { useQuery } from '@tanstack/react-query'
import { getPersonalDashboard, getTeamDashboard } from '../api/dashboard.api'
import { queryKeys } from '../api/query-client'
import { useAuth } from './useAuth'

export function usePersonalDashboard() {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.dashboard.personal, user?.id],
    queryFn: ({ signal }) => getPersonalDashboard(user!, signal),
    enabled: isAuthenticated && Boolean(user),
  })
}

export function useTeamDashboard(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.dashboard.team,
    queryFn: ({ signal }) => getTeamDashboard(signal),
    enabled,
  })
}
