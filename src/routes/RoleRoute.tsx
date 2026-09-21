import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { canAccessRoute } from '../features/auth/permissions'
import type { UserRole } from '../types/auth'

interface RoleRouteProps {
  roles: readonly UserRole[]
  /** Ruta de respaldo si el rol no tiene permiso. */
  fallbackTo?: string
}

/** Protección visual por rol. El backend sigue siendo la autoridad real. */
export function RoleRoute({ roles, fallbackTo = '/app/dashboard' }: RoleRouteProps) {
  const { user } = useAuth()

  if (!canAccessRoute(user?.role, roles)) {
    return <Navigate to={fallbackTo} replace />
  }

  return <Outlet />
}
