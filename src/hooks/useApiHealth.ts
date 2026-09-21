import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../api/health.api'
import { queryKeys } from '../api/query-client'
import { ApiError } from '../types/api'

/** Consulta el endpoint `/health` del API (Fase 2). */
export function useApiHealth(enabled = true) {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: ({ signal }) => getHealth(signal),
    enabled,
    staleTime: 60_000,
    retry: 1,
  })
}

export function getHealthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  return 'No se pudo verificar el estado del API.'
}
