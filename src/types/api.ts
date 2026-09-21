/**
 * Tipos compartidos para respuestas y errores del API NestJS.
 * TEMPORAL: hasta que el backend publique el contrato final, estos tipos
 * pueden ajustarse sin romper las pantallas demo (LocalStorage).
 */

export interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
  error?: string
  code?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly details?: string | string[]
  readonly isUnauthorized: boolean
  readonly isNetworkError: boolean

  constructor(options: {
    message: string
    status: number
    code?: string
    details?: string | string[]
    isNetworkError?: boolean
  }) {
    super(options.message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.details = options.details
    this.isUnauthorized = options.status === 401
    this.isNetworkError = options.isNetworkError ?? false
  }
}

export interface HealthResponse {
  status: 'ok' | string
  service?: string
  timestamp?: string
  [key: string]: unknown
}
