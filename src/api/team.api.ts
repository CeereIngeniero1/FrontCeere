import { apiGet } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import { buildDemoTeamMembers } from '../features/team/demoTeam'
import type { TeamMembersResult } from '../types/team'

/** GET /team/members?from=&to= */
export async function getTeamMembers(
  periodFrom: string,
  periodTo: string,
  signal?: AbortSignal,
): Promise<TeamMembersResult> {
  if (isDemoAuthMode()) {
    return buildDemoTeamMembers(periodFrom, periodTo)
  }
  const params = new URLSearchParams({ from: periodFrom, to: periodTo })
  const data = await apiGet<TeamMembersResult>(`/team/members?${params}`, { signal })
  return { ...data, isDemoData: false }
}
