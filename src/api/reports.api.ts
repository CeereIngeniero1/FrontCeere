import { apiGet } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import { buildDemoReportsSummary } from '../features/reports/demoReports'
import type { ReportsQuery, ReportsSummary } from '../types/reports'

/** GET /reports/summary?from=&to= */
export async function getReportsSummary(
  query: ReportsQuery,
  signal?: AbortSignal,
): Promise<ReportsSummary> {
  if (isDemoAuthMode()) {
    return buildDemoReportsSummary(query)
  }
  const params = new URLSearchParams({ from: query.from, to: query.to })
  const data = await apiGet<ReportsSummary>(`/reports/summary?${params}`, { signal })
  return { ...data, isDemoData: false }
}
