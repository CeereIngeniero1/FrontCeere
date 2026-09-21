import type { AuthSession } from '../types'
import { readStorage, removeStorage, writeStorage } from './storage'

const DEMO_EMAIL = 'admin@ceere.test'
const DEMO_PASSWORD = 'demo123'

export const demoCredentials = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
} as const

export function getSession(): AuthSession | null {
  return readStorage<AuthSession | null>('session', null)
}

export function login(email: string, password: string): AuthSession | null {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return null
  }

  const session: AuthSession = {
    email: DEMO_EMAIL,
    name: 'Administrador Demo',
    loggedInAt: new Date().toISOString(),
  }

  writeStorage('session', session)
  return session
}

export function logout(): void {
  removeStorage('session')
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}
