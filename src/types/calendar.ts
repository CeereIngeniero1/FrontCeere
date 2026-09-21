import type { Appointment, AppointmentType } from './index'

export type CalendarViewMode = 'month' | 'week' | 'day'
export type EventVisibility = 'personal' | 'shared'
export type EventStatus = 'active' | 'cancelled'

export interface CalendarEvent extends Appointment {
  visibility: EventVisibility
  status: EventStatus
  endTime?: string
}

export interface CalendarFilters {
  assignee?: string
  type?: AppointmentType | ''
  visibility?: EventVisibility | ''
  includeCancelled?: boolean
}

export interface CalendarEventPayload {
  title: string
  date: string
  time: string
  endTime?: string
  type: AppointmentType
  assignee: string
  description?: string
  visibility: EventVisibility
}

export interface CalendarListResult {
  items: CalendarEvent[]
  isDemoData: boolean
}

export const eventVisibilityLabels: Record<EventVisibility, string> = {
  personal: 'Personal',
  shared: 'Compartido',
}
