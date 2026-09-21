import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getTodayDailyReport,
  listMyDailyReports,
  listTeamDailyReports,
  saveDailyReport,
} from '../api/daily-reports.api'
import { queryKeys } from '../api/query-client'
import { useAuth } from './useAuth'
import type { DailyReportPayload } from '../types/daily-reports'

export function useTodayDailyReport() {
  const { user, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.dailyReports.today, user?.id],
    queryFn: ({ signal }) => getTodayDailyReport(user!, signal),
    enabled: isAuthenticated && Boolean(user),
  })
}

export function useMyDailyReports() {
  const { user, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.dailyReports.mine, user?.id],
    queryFn: ({ signal }) => listMyDailyReports(user!, signal),
    enabled: isAuthenticated && Boolean(user),
  })
}

export function useTeamDailyReports(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.dailyReports.team,
    queryFn: ({ signal }) => listTeamDailyReports(signal),
    enabled,
  })
}

export function useSaveDailyReport() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      payload,
      existingId,
    }: {
      payload: DailyReportPayload
      existingId?: string | null
    }) => saveDailyReport(user!, payload, existingId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dailyReports.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.personal }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.team }),
      ])
    },
  })
}
