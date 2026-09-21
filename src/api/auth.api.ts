import { apiGet, apiPost } from './http-client'
import type { AuthUser, AuthUserResponse, LoginPayload } from '../types/auth'

function unwrapUser(data: AuthUserResponse | AuthUser): AuthUser {
  if (data && typeof data === 'object' && 'user' in data) {
    return (data as AuthUserResponse).user
  }
  return data as AuthUser
}

/** POST /auth/login — la sesión viaja en cookies HTTP-only. */
export async function loginRequest(
  payload: LoginPayload,
  signal?: AbortSignal,
): Promise<AuthUser> {
  const data = await apiPost<AuthUserResponse | AuthUser>('/auth/login', payload, {
    signal,
  })
  return unwrapUser(data)
}

/** POST /auth/logout */
export async function logoutRequest(signal?: AbortSignal): Promise<void> {
  await apiPost<void>('/auth/logout', undefined, { signal })
}

/** POST /auth/refresh */
export async function refreshRequest(): Promise<void> {
  await apiPost<void>('/auth/refresh', undefined, {
    headers: { 'X-Skip-Auth-Refresh': '1' },
  })
}

/** GET /auth/me */
export async function meRequest(signal?: AbortSignal): Promise<AuthUser> {
  const data = await apiGet<AuthUserResponse | AuthUser>('/auth/me', {
    signal,
    headers: { 'X-Skip-Auth-Refresh': '1' },
  })
  return unwrapUser(data)
}
