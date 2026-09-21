import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  title?: string
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
}

export function Alert({ variant = 'info', children, title }: AlertProps) {
  const Icon = icons[variant]
  return (
    <div className={`alert alert-${variant}`} role="status">
      <Icon size={18} aria-hidden className="alert-icon" />
      <div>
        {title ? <strong className="alert-title">{title}</strong> : null}
        <div>{children}</div>
      </div>
    </div>
  )
}
