import { apiGet } from './http-client'
import type { HealthResponse } from '../types/api'

/**
 * Health check del API.
 * Ruta relativa a VITE_API_URL (que ya incluye `/api`):
 *   GET {VITE_API_URL}/health  →  https://api-prueba.ceere.net/api/health
 */
export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiGet<HealthResponse>('/health', { signal })
}
