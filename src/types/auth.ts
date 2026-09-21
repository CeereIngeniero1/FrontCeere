/**
 * Contrato de autenticación esperado del API NestJS (BackCeere).
 *
 * Endpoints (relativos a VITE_API_URL, que ya incluye `/api`):
 * - POST /auth/login   body: { email, password } → { user } + cookies HTTP-only
 * - POST /auth/logout  → limpia cookies
 * - POST /auth/refresh → renueva cookies (sin body)
 * - GET  /auth/me      → { user } | 401
 *
 * El frontend NUNCA guarda refresh tokens ni contraseñas en localStorage.
 */

export type UserRole = 'ADMIN' | 'LEADER' | 'MEMBER'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUserResponse {
  user: AuthUser
}

/** @deprecated Prefer AuthUser. Conservado solo para tipos legacy de datos demo. */
export interface AuthSession {
  email: string
  name: string
  loggedInAt: string
  role?: UserRole
}
