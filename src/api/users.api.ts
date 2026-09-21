import { apiGet, apiPatch, apiPost } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import {
  createDemoUser,
  listDemoUsers,
  updateDemoUser,
} from '../features/users/demoUsers'
import type {
  CreateUserPayload,
  ManagedUser,
  UpdateUserPayload,
  UsersListResult,
} from '../types/users'

/** GET /users */
export async function listUsers(signal?: AbortSignal): Promise<UsersListResult> {
  if (isDemoAuthMode()) {
    return { items: listDemoUsers(), isDemoData: true }
  }
  const data = await apiGet<ManagedUser[] | UsersListResult>('/users', { signal })
  if (Array.isArray(data)) return { items: data, isDemoData: false }
  return { ...data, isDemoData: false }
}

/** POST /users */
export async function createUser(payload: CreateUserPayload): Promise<ManagedUser> {
  if (isDemoAuthMode()) return createDemoUser(payload)
  return apiPost<ManagedUser>('/users', payload)
}

/** PATCH /users/:id */
export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<ManagedUser> {
  if (isDemoAuthMode()) return updateDemoUser(id, payload)
  return apiPatch<ManagedUser>(`/users/${id}`, payload)
}
