import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createManualTimeEntry,
  deleteTimeEntry,
  getTimeSummary,
  listTimeEntries,
  startTimer,
  stopTimer,
} from '../api/time.api'
import { queryKeys } from '../api/query-client'
import type { ManualTimePayload, StartTimerPayload } from '../types/time'

export function useTimeSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.time.summary,
    queryFn: ({ signal }) => getTimeSummary(signal),
    refetchInterval: (query) => (query.state.data?.activeTimer ? 15_000 : false),
  })
}

export function useTimeEntriesQuery() {
  return useQuery({
    queryKey: queryKeys.time.entries,
    queryFn: ({ signal }) => listTimeEntries(signal),
  })
}

export function useTimeMutations() {
  const queryClient = useQueryClient()

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.time.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.personal }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.team }),
    ])
  }

  const startMutation = useMutation({
    mutationFn: (payload: StartTimerPayload) => startTimer(payload),
    onSuccess: () => void invalidate(),
  })

  const stopMutation = useMutation({
    mutationFn: () => stopTimer(),
    onSuccess: () => void invalidate(),
  })

  const createMutation = useMutation({
    mutationFn: (payload: ManualTimePayload) => createManualTimeEntry(payload),
    onSuccess: () => void invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTimeEntry(id),
    onSuccess: () => void invalidate(),
  })

  return { startMutation, stopMutation, createMutation, deleteMutation }
}
