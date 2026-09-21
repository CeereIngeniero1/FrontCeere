import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { companyInfo } from '../data/company'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/ceere-sio', label: 'Ceere SIO' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const close = () => setOpen(false)

  return (
    <div className="public-layout">
      <header className={`public-header ${open ? 'is-open' : ''}`}>
        <div className="container public-header-inner">
          <Logo />
          <nav className="public-nav" aria-label="Navegación principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={close}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="public-header-actions">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                close()
                navigate('/login')
              }}
            >
              Iniciar sesión
            </Button>
          </div>
          <Button
            className="nav-toggle"
            variant="ghost"
            size="sm"
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </Button>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo variant="light" />
              <p style={{ marginTop: '1rem' }}>{companyInfo.tagline}</p>
              <p>{companyInfo.legalName}</p>
            </div>
            <div>
              <h3>Navegación</h3>
              <ul>
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} onClick={close}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Contacto</h3>
              <ul>
                <li>{companyInfo.contact.address}</li>
                <li>
                  <a href={`tel:+${companyInfo.contact.phoneRaw}`}>
                    {companyInfo.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${companyInfo.contact.email}`}>
                    {companyInfo.contact.email}
                  </a>
                </li>
                <li>
                  {companyInfo.contact.schedule[0].day}:{' '}
                  {companyInfo.contact.schedule[0].hours}
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            Frontend de prueba — no reemplaza el sitio en producción de ceere.net.
          </div>
        </div>
      </footer>
    </div>
  )
}
