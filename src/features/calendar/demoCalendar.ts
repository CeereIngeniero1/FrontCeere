/**
 * TEMPORAL (DEMO) — eventos de agenda en LocalStorage.
 */
import { initialAppointments } from '../../data/appointments'
import { getAppointments, saveAppointments } from '../../services/dataService'
import type { Appointment } from '../../types'
import type {
  CalendarEvent,
  CalendarEventPayload,
  CalendarFilters,
} from '../../types/calendar'
import { createId } from '../../utils'

function normalize(item: Appointment): CalendarEvent {
  return {
    ...item,
    visibility: item.visibility ?? 'shared',
    status: item.status ?? 'active',
    endTime: item.endTime,
  }
}

function ensure(): CalendarEvent[] {
  const stored = getAppointments()
  if (stored.length === 0) {
    saveAppointments(initialAppointments)
    return initialAppointments.map(normalize)
  }
  return stored.map(normalize)
}

function persist(events: CalendarEvent[]): void {
  saveAppointments(events)
}

export function listDemoCalendarEvents(
  filters: CalendarFilters = {},
): CalendarEvent[] {
  return ensure()
    .filter((event) => {
      if (!filters.includeCancelled && event.status === 'cancelled') return false
      if (filters.assignee && event.assignee !== filters.assignee) return false
      if (filters.type && event.type !== filters.type) return false
      if (filters.visibility && event.visibility !== filters.visibility) return false
      return true
    })
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
}

export function createDemoCalendarEvent(payload: CalendarEventPayload): CalendarEvent {
  const event: CalendarEvent = {
    id: createId('appt'),
    title: payload.title.trim(),
    date: payload.date,
    time: payload.time,
    endTime: payload.endTime,
    type: payload.type,
    assignee: payload.assignee,
    description: payload.description?.trim() ?? '',
    visibility: payload.visibility,
    status: 'active',
  }
  persist([event, ...ensure()])
  return event
}

export function updateDemoCalendarEvent(
  id: string,
  payload: Partial<CalendarEventPayload> & { status?: CalendarEvent['status'] },
): CalendarEvent {
  const events = ensure()
  const index = events.findIndex((item) => item.id === id)
  if (index < 0) throw new Error('Evento no encontrado')
  const next: CalendarEvent = {
    ...events[index],
    ...payload,
    title: payload.title?.trim() ?? events[index].title,
    description:
      payload.description !== undefined
        ? payload.description.trim()
        : events[index].description,
  }
  const copy = [...events]
  copy[index] = next
  persist(copy)
  return next
}

export function cancelDemoCalendarEvent(id: string): CalendarEvent {
  return updateDemoCalendarEvent(id, { status: 'cancelled' })
}

export function deleteDemoCalendarEvent(id: string): void {
  persist(ensure().filter((item) => item.id !== id))
}

export const DEMO_CALENDAR_ASSIGNEES = [
  'Ana Gómez',
  'Carlos Ruiz',
  'Laura Méndez',
  'Administrador Demo',
  'Líder Demo',
  'Miembro Demo',
] as const
