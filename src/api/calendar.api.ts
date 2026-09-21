import { apiDelete, apiGet, apiPatch, apiPost } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import {
  cancelDemoCalendarEvent,
  createDemoCalendarEvent,
  deleteDemoCalendarEvent,
  listDemoCalendarEvents,
  updateDemoCalendarEvent,
} from '../features/calendar/demoCalendar'
import type {
  CalendarEvent,
  CalendarEventPayload,
  CalendarFilters,
  CalendarListResult,
} from '../types/calendar'

function toQuery(filters: CalendarFilters): string {
  const params = new URLSearchParams()
  if (filters.assignee) params.set('assignee', filters.assignee)
  if (filters.type) params.set('type', filters.type)
  if (filters.visibility) params.set('visibility', filters.visibility)
  if (filters.includeCancelled) params.set('includeCancelled', 'true')
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** GET /calendar/events */
export async function listCalendarEvents(
  filters: CalendarFilters = {},
  signal?: AbortSignal,
): Promise<CalendarListResult> {
  if (isDemoAuthMode()) {
    return { items: listDemoCalendarEvents(filters), isDemoData: true }
  }
  const data = await apiGet<CalendarEvent[] | CalendarListResult>(
    `/calendar/events${toQuery(filters)}`,
    { signal },
  )
  if (Array.isArray(data)) return { items: data, isDemoData: false }
  return { ...data, isDemoData: false }
}

/** POST /calendar/events */
export async function createCalendarEvent(
  payload: CalendarEventPayload,
): Promise<CalendarEvent> {
  if (isDemoAuthMode()) return createDemoCalendarEvent(payload)
  return apiPost<CalendarEvent>('/calendar/events', payload)
}

/** PATCH /calendar/events/:id */
export async function updateCalendarEvent(
  id: string,
  payload: Partial<CalendarEventPayload> & { status?: CalendarEvent['status'] },
): Promise<CalendarEvent> {
  if (isDemoAuthMode()) return updateDemoCalendarEvent(id, payload)
  return apiPatch<CalendarEvent>(`/calendar/events/${id}`, payload)
}

/** POST /calendar/events/:id/cancel */
export async function cancelCalendarEvent(id: string): Promise<CalendarEvent> {
  if (isDemoAuthMode()) return cancelDemoCalendarEvent(id)
  return apiPost<CalendarEvent>(`/calendar/events/${id}/cancel`)
}

/** DELETE /calendar/events/:id */
export async function deleteCalendarEvent(id: string): Promise<void> {
  if (isDemoAuthMode()) {
    deleteDemoCalendarEvent(id)
    return
  }
  await apiDelete<void>(`/calendar/events/${id}`)
}
