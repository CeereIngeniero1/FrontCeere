import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { demoCredentials } from '../../services/authService'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const session = login(email, password)
    if (!session) {
      setError('Credenciales incorrectas. Use las credenciales de demostración.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Logo to="/" />
        <h1 style={{ marginTop: '1.25rem' }}>Iniciar sesión</h1>
        <p className="lead">
          Acceso simulado al panel administrativo de prueba. No es un sistema de
          autenticación de producción.
        </p>

        <Alert variant="info" title="Credenciales de demostración">
          Correo: {demoCredentials.email}
          <br />
          Contraseña: {demoCredentials.password}
        </Alert>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <form onSubmit={handleSubmit} noValidate>
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
          <Button type="submit" style={{ width: '100%' }}>
            Entrar al panel
          </Button>
        </form>

        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          <Link to="/">Volver al sitio público</Link>
        </p>
      </Card>
    </div>
  )
}
