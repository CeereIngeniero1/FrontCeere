import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ApiError, type ApiErrorBody } from '../types/api'

const DEFAULT_TIMEOUT_MS = 20_000

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<void> | null = null
let onSessionExpired: (() => void) | null = null

/** Registra callback para limpiar estado de auth cuando el refresh falla. */
export function setSessionExpiredHandler(handler: (() => void) | null): void {
  onSessionExpired = handler
}

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim()
  if (!raw) {
    console.warn(
      '[http-client] VITE_API_URL no está definida. Use `.env` o `.env.example`.',
    )
    return ''
  }
  return raw.replace(/\/+$/, '')
}

function messageFromBody(body: ApiErrorBody | undefined, fallback: string): string {
  if (!body) return fallback
  if (Array.isArray(body.message)) {
    return body.message.filter(Boolean).join('. ') || fallback
  }
  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message
  }
  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error
  }
  return fallback
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>
    if (!axiosError.response) {
      return new ApiError({
        message:
          'No se pudo conectar con el servidor. Verifique su red o que el API esté en línea.',
        status: 0,
        isNetworkError: true,
      })
    }

    const status = axiosError.response.status
    const body = axiosError.response.data
    const fallback =
      status === 401
        ? 'Sesión no válida o expirada.'
        : status === 403
          ? 'No tiene permiso para esta acción.'
          : status >= 500
            ? 'El servidor respondió con un error. Intente de nuevo más tarde.'
            : 'La solicitud no pudo completarse.'

    return new ApiError({
      message: messageFromBody(body, fallback),
      status,
      code: body?.code,
      details: body?.message,
    })
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message, status: 0, isNetworkError: true })
  }

  return new ApiError({
    message: 'Error inesperado al comunicarse con el API.',
    status: 0,
    isNetworkError: true,
  })
}

function shouldSkipRefresh(config?: InternalAxiosRequestConfig): boolean {
  if (!config) return true
  if (config.headers?.['X-Skip-Auth-Refresh'] === '1') return true
  const url = config.url ?? ''
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/me')
  )
}

async function refreshSessionOnce(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = httpClient
      .post('/auth/refresh', undefined, {
        headers: { 'X-Skip-Auth-Refresh': '1' },
      })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

/**
 * Cliente Axios centralizado.
 * - withCredentials: cookies HTTP-only
 * - un solo intento de refresh ante 401 (sin bucles)
 * - cancelación vía AbortSignal (`config.signal`)
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: DEFAULT_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrl()
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as RetriableConfig | undefined
    const status = error.response?.status

    if (status === 401 && original && !original._retry && !shouldSkipRefresh(original)) {
      original._retry = true
      try {
        await refreshSessionOnce()
        return httpClient.request(original)
      } catch {
        onSessionExpired?.()
        return Promise.reject(toApiError(error))
      }
    }

    return Promise.reject(toApiError(error))
  },
)

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await httpClient.get<T>(url, config)
  return data
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await httpClient.post<T>(url, body, config)
  return data
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await httpClient.patch<T>(url, body, config)
  return data
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await httpClient.put<T>(url, body, config)
  return data
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await httpClient.delete<T>(url, config)
  return data
}
