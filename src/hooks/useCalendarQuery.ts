import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  cancelCalendarEvent,
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
  updateCalendarEvent,
} from '../api/calendar.api'
import { queryKeys } from '../api/query-client'
import type { CalendarEventPayload, CalendarFilters } from '../types/calendar'

export function useCalendarEventsQuery(filters: CalendarFilters) {
  return useQuery({
    queryKey: [...queryKeys.calendar.list, filters],
    queryFn: ({ signal }) => listCalendarEvents(filters, signal),
  })
}

export function useCalendarMutations() {
  const queryClient = useQueryClient()

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.personal }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.team }),
    ])
  }

  const createMutation = useMutation({
    mutationFn: (payload: CalendarEventPayload) => createCalendarEvent(payload),
    onSuccess: () => void invalidate(),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CalendarEventPayload> & { status?: 'active' | 'cancelled' }
    }) => updateCalendarEvent(id, payload),
    onSuccess: () => void invalidate(),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelCalendarEvent(id),
    onSuccess: () => void invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCalendarEvent(id),
    onSuccess: () => void invalidate(),
  })

  return { createMutation, updateMutation, cancelMutation, deleteMutation }
}
