/**
 * TEMPORAL (DEMO) — registros de tiempo + timer en sessionStorage.
 * La duración oficial al detener se calcula aquí (simula backend).
 */
import { initialTimeEntries } from '../../data/timeEntries'
import { getTasks } from '../../services/dataService'
import { getTimeEntries, saveTimeEntries } from '../../services/dataService'
import type { TimeEntry } from '../../types'
import type {
  ActiveTimer,
  ManualTimePayload,
  StartTimerPayload,
  TimeCategory,
  TimeEntryExtended,
  TimeSummary,
} from '../../types/time'
import { createId, formatMinutes, minutesBetween, startOfWeekISO, todayISO } from '../../utils'

const TIMER_KEY = 'ceere_DEMO_active_timer'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function timeFromDate(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function ensureEntries(): TimeEntryExtended[] {
  const stored = getTimeEntries() as TimeEntryExtended[]
  if (stored.length === 0) {
    saveTimeEntries(initialTimeEntries)
    return [...initialTimeEntries]
  }
  return stored
}

export function readDemoTimer(): ActiveTimer | null {
  try {
    const raw = sessionStorage.getItem(TIMER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ActiveTimer
  } catch {
    return null
  }
}

function writeDemoTimer(timer: ActiveTimer | null): void {
  if (!timer) {
    sessionStorage.removeItem(TIMER_KEY)
    return
  }
  sessionStorage.setItem(TIMER_KEY, JSON.stringify(timer))
}

export function listDemoTimeEntries(): TimeEntryExtended[] {
  return ensureEntries().sort((a, b) =>
    `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`),
  )
}

export function getDemoTimeSummary(): TimeSummary {
  const today = todayISO()
  const weekStart = startOfWeekISO()
  const entries = listDemoTimeEntries()
  const entriesToday = entries.filter((e) => e.date === today)
  const entriesWeek = entries.filter((e) => e.date >= weekStart && e.date <= today)

  const byCategoryMap = new Map<string, number>()
  for (const entry of entriesWeek) {
    const key = String(entry.category ?? entry.project ?? 'otro')
    byCategoryMap.set(key, (byCategoryMap.get(key) ?? 0) + entry.totalMinutes)
  }

  return {
    todayMinutes: entriesToday.reduce((s, e) => s + e.totalMinutes, 0),
    weekMinutes: entriesWeek.reduce((s, e) => s + e.totalMinutes, 0),
    byCategory: [...byCategoryMap.entries()]
      .map(([category, minutes]) => ({ category, minutes }))
      .sort((a, b) => b.minutes - a.minutes),
    entriesToday,
    entriesWeek,
    activeTimer: readDemoTimer(),
    isDemoData: true,
  }
}

export function startDemoTimer(payload: StartTimerPayload): ActiveTimer {
  if (readDemoTimer()) {
    throw new Error('Ya hay una actividad en curso. Deténgala antes de iniciar otra.')
  }
  const tasks = getTasks()
  const task = payload.taskId ? tasks.find((t) => t.id === payload.taskId) : undefined
  const timer: ActiveTimer = {
    id: createId('timer'),
    taskId: payload.taskId ?? null,
    taskTitle: task?.title ?? null,
    category: payload.category,
    description: payload.description.trim(),
    startedAt: new Date().toISOString(),
  }
  writeDemoTimer(timer)
  return timer
}

/** Detiene el timer; la duración oficial se calcula aquí (simula backend). */
export function stopDemoTimer(): TimeEntry {
  const timer = readDemoTimer()
  if (!timer) {
    throw new Error('No hay actividad activa para detener.')
  }
  const started = new Date(timer.startedAt)
  const ended = new Date()
  const totalMinutes = Math.max(1, Math.round((ended.getTime() - started.getTime()) / 60000))
  const entry: TimeEntryExtended = {
    id: createId('time'),
    activity: timer.description,
    project: timer.taskTitle ?? timer.category,
    date: todayISO(),
    startTime: timeFromDate(started),
    endTime: timeFromDate(ended),
    totalMinutes,
    notes: `Registro por temporizador (oficial: ${formatMinutes(totalMinutes)})`,
    taskId: timer.taskId,
    category: timer.category,
  }
  saveTimeEntries([entry, ...ensureEntries()])
  writeDemoTimer(null)
  return entry
}

export function createDemoManualEntry(payload: ManualTimePayload): TimeEntry {
  const total = minutesBetween(payload.startTime, payload.endTime)
  if (total <= 0) {
    throw new Error('La hora de finalización debe ser posterior a la de inicio.')
  }
  const tasks = getTasks()
  const task = payload.taskId ? tasks.find((t) => t.id === payload.taskId) : undefined
  const entry: TimeEntryExtended = {
    id: createId('time'),
    activity: payload.description.trim(),
    project: task?.title ?? payload.category,
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    totalMinutes: total,
    notes: payload.notes?.trim() ?? '',
    taskId: payload.taskId ?? null,
    category: payload.category as TimeCategory,
  }
  saveTimeEntries([entry, ...ensureEntries()])
  return entry
}

export function deleteDemoTimeEntry(id: string): void {
  saveTimeEntries(ensureEntries().filter((e) => e.id !== id))
}
