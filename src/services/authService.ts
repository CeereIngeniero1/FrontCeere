/**
 * @deprecated El auth real está en `src/api/auth.api.ts` + `AuthContext`.
 * Este módulo solo reexporta utilidades DEMO temporales.
 */
export {
  clearDemoUser,
  demoCredentials,
  demoLogin,
  isDemoAuthMode,
  readDemoUser,
} from '../features/auth/demoAuth'

/** Compatibilidad: ya no hay getSession/login síncronos en LocalStorage. */
export function getSession(): null {
  return null
}

export function isAuthenticated(): boolean {
  return false
}

export function login(): null {
  console.warn('[authService] Use AuthContext.login() instead.')
  return null
}

export function logout(): void {
  console.warn('[authService] Use AuthContext.logout() instead.')
}
