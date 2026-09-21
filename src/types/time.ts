import type { TimeEntry } from './index'

export type TimeCategory =
  | 'desarrollo'
  | 'soporte'
  | 'reunion'
  | 'documentacion'
  | 'administracion'
  | 'otro'

export const TIME_CATEGORIES: readonly TimeCategory[] = [
  'desarrollo',
  'soporte',
  'reunion',
  'documentacion',
  'administracion',
  'otro',
] as const

export const timeCategoryLabels: Record<TimeCategory, string> = {
  desarrollo: 'Desarrollo',
  soporte: 'Soporte',
  reunion: 'Reunión',
  documentacion: 'Documentación',
  administracion: 'Administración',
  otro: 'Otro',
}

export interface ActiveTimer {
  id: string
  taskId?: string | null
  taskTitle?: string | null
  category: TimeCategory
  description: string
  startedAt: string
}

export interface StartTimerPayload {
  taskId?: string | null
  category: TimeCategory
  description: string
}

export interface ManualTimePayload {
  taskId?: string | null
  category: TimeCategory
  description: string
  date: string
  startTime: string
  endTime: string
  notes?: string
}

export interface TimeSummary {
  todayMinutes: number
  weekMinutes: number
  byCategory: Array<{ category: string; minutes: number }>
  entriesToday: TimeEntry[]
  entriesWeek: TimeEntry[]
  activeTimer: ActiveTimer | null
  isDemoData: boolean
}

/** Extiende TimeEntry con campos de Fase 7 (compatibles con datos viejos). */
export type TimeEntryExtended = TimeEntry & {
  taskId?: string | null
  category?: TimeCategory | string
}
