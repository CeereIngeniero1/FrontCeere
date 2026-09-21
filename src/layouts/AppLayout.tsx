import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  PieChart,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS, filterNavByRole } from '../features/auth/permissions'
import type { AppNavKey } from '../features/auth/permissions'

const ICONS: Record<AppNavKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  tareas: ClipboardList,
  tiempo: Clock3,
  'reporte-diario': NotebookPen,
  agenda: CalendarDays,
  equipo: Users,
  reportes: PieChart,
  configuracion: Settings,
}

export function AppLayout() {
  const { user, logout, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = useMemo(() => filterNavByRole(user?.role), [user?.role])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Cerrar menú lateral"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside className="admin-sidebar" aria-label="Menú de la plataforma">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo to="/app/dashboard" variant="light" />
          <Button
            className="mobile-menu-btn"
            variant="ghost"
            size="sm"
            aria-label="Cerrar menú"
            onClick={() => setSidebarOpen(false)}
            style={{ color: 'white' }}
          >
            <X size={18} aria-hidden />
          </Button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = ICONS[item.key]
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                <Icon size={18} aria-hidden />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <Button
            className="mobile-menu-btn"
            variant="ghost"
            size="sm"
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} aria-hidden />
          </Button>
          <div className="admin-topbar-user">
            <div>
              <strong>{user?.name ?? 'Usuario'}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
                {user?.email}
                {user?.role ? ` · ${ROLE_LABELS[user.role]}` : null}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
              <LogOut size={16} aria-hidden />
              Cerrar sesión
            </Button>
          </div>
        </header>

        <div className="admin-content">
          {isDemoMode ? (
            <div className="demo-banner" role="status">
              Modo DEMO temporal (`VITE_AUTH_MODE=demo`): sesión en sessionStorage, sin
              cookies reales. Los datos de tareas/agenda/tiempo siguen en LocalStorage.
              Cambie a `VITE_AUTH_MODE=api` cuando BackCeere esté disponible.
            </div>
          ) : (
            <div className="demo-banner demo-banner--api" role="status">
              Sesión autenticada vía API (cookies HTTP-only). Los módulos de negocio
              aún pueden mostrar datos demo hasta las fases siguientes.
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
