import type { UserRole } from './auth'

/** Usuario administrable (sin contraseña en respuestas). */
export interface ManagedUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  name: string
  email: string
  role: UserRole
  /** Solo se envía al crear; nunca se vuelve a mostrar. */
  temporaryPassword: string
}

export interface UpdateUserPayload {
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

export interface UsersListResult {
  items: ManagedUser[]
  isDemoData: boolean
}
