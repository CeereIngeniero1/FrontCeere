import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  X,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/tareas', label: 'Tareas', icon: ClipboardList },
  { to: '/admin/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/admin/tiempo', label: 'Tiempo', icon: Clock3 },
  { to: '/admin/reportes', label: 'Reportes', icon: PieChart },
]

export function AdminLayout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
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

      <aside className="admin-sidebar" aria-label="Menú administrativo">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo to="/admin" variant="light" />
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
            const Icon = item.icon
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
              <strong>{session?.name ?? 'Usuario demo'}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
                {session?.email}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} aria-hidden />
              Cerrar sesión
            </Button>
          </div>
        </header>

        <div className="admin-content">
          <div className="demo-banner" role="status">
            Datos demostrativos almacenados en este navegador (LocalStorage). No hay
            conexión con un servidor real.
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
