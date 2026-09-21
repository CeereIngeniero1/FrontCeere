import type { UserRole } from '../../types/auth'

/**
 * TEMPORAL (DEMO) — solo activo con VITE_AUTH_MODE=demo.
 * Simula usuarios reales hasta que BackCeere publique /auth/*.
 * No almacena contraseñas ni tokens de refresh.
 */

export const DEMO_USERS = [
  {
    id: 'demo-admin',
    email: 'admin@ceere.test',
    password: 'demo123',
    name: 'Administrador Demo',
    role: 'ADMIN' as UserRole,
    isActive: true,
  },
  {
    id: 'demo-leader',
    email: 'lider@ceere.test',
    password: 'demo123',
    name: 'Líder Demo',
    role: 'LEADER' as UserRole,
    isActive: true,
  },
  {
    id: 'demo-member',
    email: 'miembro@ceere.test',
    password: 'demo123',
    name: 'Miembro Demo',
    role: 'MEMBER' as UserRole,
    isActive: true,
  },
] as const

export const demoCredentials = {
  email: DEMO_USERS[0].email,
  password: DEMO_USERS[0].password,
  accounts: DEMO_USERS.map(({ email, password, role, name }) => ({
    email,
    password,
    role,
    name,
  })),
} as const

const DEMO_SESSION_KEY = 'ceere_DEMO_auth_user'

export function isDemoAuthMode(): boolean {
  const mode = (import.meta.env.VITE_AUTH_MODE ?? 'demo').toLowerCase()
  return mode === 'demo'
}

export function readDemoUser() {
  try {
    const raw = sessionStorage.getItem(DEMO_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as {
      id: string
      email: string
      name: string
      role: UserRole
      isActive: boolean
    }
  } catch {
    return null
  }
}

export function writeDemoUser(user: {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
}): void {
  sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
}

export function clearDemoUser(): void {
  sessionStorage.removeItem(DEMO_SESSION_KEY)
}

export function demoLogin(email: string, password: string) {
  const found = DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )
  if (!found) return null
  const { password: _pw, ...user } = found
  void _pw
  writeDemoUser(user)
  return user
}
