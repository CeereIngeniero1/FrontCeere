import { apiDelete, apiGet, apiPost } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import {
  createDemoManualEntry,
  deleteDemoTimeEntry,
  getDemoTimeSummary,
  listDemoTimeEntries,
  startDemoTimer,
  stopDemoTimer,
} from '../features/time/demoTime'
import type { TimeEntry } from '../types'
import type {
  ActiveTimer,
  ManualTimePayload,
  StartTimerPayload,
  TimeSummary,
} from '../types/time'

/** GET /time/summary */
export async function getTimeSummary(signal?: AbortSignal): Promise<TimeSummary> {
  if (isDemoAuthMode()) {
    return getDemoTimeSummary()
  }
  const data = await apiGet<TimeSummary>('/time/summary', { signal })
  return { ...data, isDemoData: false }
}

/** GET /time/entries */
export async function listTimeEntries(signal?: AbortSignal): Promise<{
  items: TimeEntry[]
  isDemoData: boolean
}> {
  if (isDemoAuthMode()) {
    return { items: listDemoTimeEntries(), isDemoData: true }
  }
  const data = await apiGet<TimeEntry[] | { items: TimeEntry[] }>('/time/entries', {
    signal,
  })
  const items = Array.isArray(data) ? data : data.items
  return { items, isDemoData: false }
}

/** POST /time/timer/start */
export async function startTimer(payload: StartTimerPayload): Promise<ActiveTimer> {
  if (isDemoAuthMode()) {
    return startDemoTimer(payload)
  }
  return apiPost<ActiveTimer>('/time/timer/start', payload)
}

/** POST /time/timer/stop — duración oficial la calcula el backend */
export async function stopTimer(): Promise<TimeEntry> {
  if (isDemoAuthMode()) {
    return stopDemoTimer()
  }
  return apiPost<TimeEntry>('/time/timer/stop')
}

/** POST /time/entries */
export async function createManualTimeEntry(
  payload: ManualTimePayload,
): Promise<TimeEntry> {
  if (isDemoAuthMode()) {
    return createDemoManualEntry(payload)
  }
  return apiPost<TimeEntry>('/time/entries', payload)
}

/** DELETE /time/entries/:id */
export async function deleteTimeEntry(id: string): Promise<void> {
  if (isDemoAuthMode()) {
    deleteDemoTimeEntry(id)
    return
  }
  await apiDelete<void>(`/time/entries/${id}`)
}
