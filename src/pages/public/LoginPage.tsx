import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiHealthBadge } from '../../components/feedback/ApiHealthBadge'
import { Logo } from '../../components/Logo'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { demoCredentials } from '../../features/auth/demoAuth'
import { ApiError } from '../../types/api'

export function LoginPage() {
  const { isAuthenticated, isBootstrapping, isDemoMode, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(isDemoMode ? demoCredentials.email : '')
  const [password, setPassword] = useState(isDemoMode ? demoCredentials.password : '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from: string }).from.startsWith('/app')
      ? (location.state as { from: string }).from
      : '/app/dashboard'

  if (isBootstrapping) {
    return (
      <div className="login-page">
        <p className="auth-loading" role="status">
          Verificando sesión…
        </p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo iniciar sesión. Intente de nuevo.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Logo to="/" />
        <h1 style={{ marginTop: '1.25rem' }}>Iniciar sesión</h1>
        <p className="lead">
          {isDemoMode
            ? 'Modo DEMO temporal: la sesión no usa cookies reales del API.'
            : 'Acceso a la plataforma interna CEERE (sesión por cookies HTTP-only).'}
        </p>

        {isDemoMode ? (
          <Alert variant="info" title="Credenciales DEMO (temporales)">
            {demoCredentials.accounts.map((account) => (
              <div key={account.email}>
                {account.role}: {account.email} / {account.password}
              </div>
            ))}
          </Alert>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        <form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <Input
            label="Correo"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            autoComplete="username"
            required
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            autoComplete="current-password"
            required
          />
          <Button type="submit" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Entrando…' : 'Entrar a la plataforma'}
          </Button>
        </form>

        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          <Link to="/">Volver al sitio público</Link>
        </p>

        <ApiHealthBadge />
      </Card>
    </div>
  )
}
