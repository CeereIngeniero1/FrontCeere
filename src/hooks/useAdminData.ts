import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, listUsers, updateUser } from '../api/users.api'
import { getTeamMembers } from '../api/team.api'
import { getReportsSummary } from '../api/reports.api'
import { queryKeys } from '../api/query-client'
import type { CreateUserPayload, UpdateUserPayload } from '../types/users'
import type { ReportsQuery } from '../types/reports'

export function useUsersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.list,
    queryFn: ({ signal }) => listUsers(signal),
    enabled,
  })
}

export function useUserMutations() {
  const queryClient = useQueryClient()
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.team }),
    ])
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => void invalidate(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => void invalidate(),
  })

  return { createMutation, updateMutation }
}

export function useTeamMembersQuery(from: string, to: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.team.members, from, to],
    queryFn: ({ signal }) => getTeamMembers(from, to, signal),
    enabled: enabled && Boolean(from) && Boolean(to),
  })
}

export function useReportsSummaryQuery(query: ReportsQuery, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.reports.summary, query],
    queryFn: ({ signal }) => getReportsSummary(query, signal),
    enabled: enabled && Boolean(query.from) && Boolean(query.to),
  })
}
