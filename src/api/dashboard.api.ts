import { apiGet } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import {
  buildDemoPersonalDashboard,
  buildDemoTeamDashboard,
} from '../features/dashboard/demoDashboard'
import type { AuthUser } from '../types/auth'
import type { PersonalDashboard, TeamDashboard } from '../types/dashboard'

/**
 * GET /dashboard/me
 * En modo demo (o si el API aún no existe) usa agregador local marcado.
 */
export async function getPersonalDashboard(
  user: AuthUser,
  signal?: AbortSignal,
): Promise<PersonalDashboard> {
  if (isDemoAuthMode()) {
    return buildDemoPersonalDashboard(user)
  }

  const data = await apiGet<PersonalDashboard>('/dashboard/me', { signal })
  return { ...data, isDemoData: false }
}

/** GET /dashboard/team — ADMIN / LEADER */
export async function getTeamDashboard(signal?: AbortSignal): Promise<TeamDashboard> {
  if (isDemoAuthMode()) {
    return buildDemoTeamDashboard()
  }

  const data = await apiGet<TeamDashboard>('/dashboard/team', { signal })
  return { ...data, isDemoData: false }
}
