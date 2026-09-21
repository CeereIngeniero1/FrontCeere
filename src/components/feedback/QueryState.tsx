import type { ReactNode } from 'react'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      {label}
    </div>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="empty-state" role="status">
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <Alert variant="error" title="No se pudo cargar">
      <div className="stack-sm">
        <span>{message}</span>
        {onRetry ? (
          <div>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        ) : null}
      </div>
    </Alert>
  )
}

export function SectionCard({
  title,
  children,
  actions,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <section className="card">
      <div className="section-card-header">
        <h2>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}
