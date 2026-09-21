import type { UserRole } from '../../types/auth'

/** Rutas de la plataforma privada y roles que pueden verlas en el menú. */
export type AppNavKey =
  | 'dashboard'
  | 'tareas'
  | 'tiempo'
  | 'reporte-diario'
  | 'agenda'
  | 'equipo'
  | 'reportes'
  | 'configuracion'

export interface AppNavItem {
  key: AppNavKey
  to: string
  label: string
  end?: boolean
  roles: readonly UserRole[]
}

const ALL_ROLES: readonly UserRole[] = ['ADMIN', 'LEADER', 'MEMBER']
const LEADERS: readonly UserRole[] = ['ADMIN', 'LEADER']
const ADMIN_ONLY: readonly UserRole[] = ['ADMIN']

export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  {
    key: 'dashboard',
    to: '/app/dashboard',
    label: 'Dashboard',
    end: true,
    roles: ALL_ROLES,
  },
  { key: 'tareas', to: '/app/tareas', label: 'Tareas', roles: ALL_ROLES },
  { key: 'tiempo', to: '/app/tiempo', label: 'Tiempo', roles: ALL_ROLES },
  {
    key: 'reporte-diario',
    to: '/app/reporte-diario',
    label: 'Reporte diario',
    roles: ALL_ROLES,
  },
  { key: 'agenda', to: '/app/agenda', label: 'Agenda', roles: ALL_ROLES },
  { key: 'equipo', to: '/app/equipo', label: 'Equipo', roles: LEADERS },
  { key: 'reportes', to: '/app/reportes', label: 'Reportes', roles: LEADERS },
  {
    key: 'configuracion',
    to: '/app/configuracion',
    label: 'Configuración',
    roles: ADMIN_ONLY,
  },
]

export function canAccessRoute(role: UserRole | undefined, roles: readonly UserRole[]): boolean {
  if (!role) return false
  return roles.includes(role)
}

export function filterNavByRole(role: UserRole | undefined): AppNavItem[] {
  if (!role) return []
  return APP_NAV_ITEMS.filter((item) => item.roles.includes(role))
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  LEADER: 'Líder',
  MEMBER: 'Miembro',
}
