import { apiGet, apiPatch, apiPost } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import {
  ensureDemoTeamSeeds,
  getDemoTodayReport,
  listDemoMyReports,
  listDemoTeamReports,
  upsertDemoDailyReport,
} from '../features/daily-reports/demoDailyReports'
import type { AuthUser } from '../types/auth'
import type {
  DailyReport,
  DailyReportListResult,
  DailyReportPayload,
  DailyReportTodayResult,
} from '../types/daily-reports'

/** GET /daily-reports/today */
export async function getTodayDailyReport(
  user: AuthUser,
  signal?: AbortSignal,
): Promise<DailyReportTodayResult> {
  if (isDemoAuthMode()) {
    ensureDemoTeamSeeds(user)
    return getDemoTodayReport(user)
  }
  const data = await apiGet<DailyReportTodayResult>('/daily-reports/today', {
    signal,
  })
  return { ...data, isDemoData: false }
}

/** GET /daily-reports/me */
export async function listMyDailyReports(
  user: AuthUser,
  signal?: AbortSignal,
): Promise<DailyReportListResult> {
  if (isDemoAuthMode()) {
    return listDemoMyReports(user)
  }
  const data = await apiGet<DailyReport[] | DailyReportListResult>(
    '/daily-reports/me',
    { signal },
  )
  if (Array.isArray(data)) return { items: data, isDemoData: false }
  return { ...data, isDemoData: false }
}

/** GET /daily-reports/team — ADMIN / LEADER */
export async function listTeamDailyReports(
  signal?: AbortSignal,
): Promise<DailyReportListResult> {
  if (isDemoAuthMode()) {
    return listDemoTeamReports()
  }
  const data = await apiGet<DailyReport[] | DailyReportListResult>(
    '/daily-reports/team',
    { signal },
  )
  if (Array.isArray(data)) return { items: data, isDemoData: false }
  return { ...data, isDemoData: false }
}

/** POST /daily-reports o PATCH /daily-reports/:id */
export async function saveDailyReport(
  user: AuthUser,
  payload: DailyReportPayload,
  existingId?: string | null,
): Promise<DailyReport> {
  if (isDemoAuthMode()) {
    return upsertDemoDailyReport(user, payload)
  }
  if (existingId) {
    return apiPatch<DailyReport>(`/daily-reports/${existingId}`, payload)
  }
  return apiPost<DailyReport>('/daily-reports', payload)
}
