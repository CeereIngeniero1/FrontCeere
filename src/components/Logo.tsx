import { Link } from 'react-router-dom'

interface LogoProps {
  to?: string
  variant?: 'light' | 'dark'
}

export function Logo({ to = '/', variant = 'dark' }: LogoProps) {
  return (
    <Link to={to} className={`logo logo-${variant}`} aria-label="Ceere Software">
      {/* Estructura lista para reemplazar por <img src="/logo.svg" alt="Ceere Software" /> */}
      <span className="logo-mark" aria-hidden>
        C
      </span>
      <span className="logo-text">
        <strong>CEERE</strong> SOFTWARE
      </span>
    </Link>
  )
}
