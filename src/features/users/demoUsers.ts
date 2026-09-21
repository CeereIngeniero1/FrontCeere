/**
 * TEMPORAL (DEMO) — usuarios administrables en LocalStorage.
 * Nunca se guardan contraseñas en claro tras el alta.
 */
import { DEMO_USERS } from '../auth/demoAuth'
import { readStorage, writeStorage } from '../../services/storage'
import type { ManagedUser, CreateUserPayload, UpdateUserPayload } from '../../types/users'
import { createId } from '../../utils'

function seedUsers(): ManagedUser[] {
  const now = new Date().toISOString()
  return DEMO_USERS.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: now,
    updatedAt: now,
  }))
}

function allUsers(): ManagedUser[] {
  const stored = readStorage<ManagedUser[]>('users', [])
  if (stored.length === 0) {
    const seeded = seedUsers()
    writeStorage('users', seeded)
    return seeded
  }
  return stored
}

function saveUsers(users: ManagedUser[]): void {
  writeStorage('users', users)
}

export function listDemoUsers(): ManagedUser[] {
  return [...allUsers()].sort((a, b) => a.name.localeCompare(b.name))
}

export function createDemoUser(payload: CreateUserPayload): ManagedUser {
  void payload.temporaryPassword
  const email = payload.email.trim().toLowerCase()
  if (allUsers().some((user) => user.email === email)) {
    throw new Error('Ya existe un usuario con ese correo.')
  }
  const now = new Date().toISOString()
  const user: ManagedUser = {
    id: createId('user'),
    name: payload.name.trim(),
    email,
    role: payload.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }
  saveUsers([user, ...allUsers()])
  return user
}

export function updateDemoUser(id: string, payload: UpdateUserPayload): ManagedUser {
  const users = allUsers()
  const index = users.findIndex((user) => user.id === id)
  if (index < 0) throw new Error('Usuario no encontrado')

  const email = payload.email.trim().toLowerCase()
  if (users.some((user) => user.email === email && user.id !== id)) {
    throw new Error('Ya existe un usuario con ese correo.')
  }

  const updated: ManagedUser = {
    ...users[index],
    name: payload.name.trim(),
    email,
    role: payload.role,
    isActive: payload.isActive,
    updatedAt: new Date().toISOString(),
  }
  const next = [...users]
  next[index] = updated
  saveUsers(next)
  return updated
}
