import { getHealthErrorMessage, useApiHealth } from '../../hooks/useApiHealth'
import { getApiBaseUrl } from '../../api/http-client'

/**
 * Indicador de conectividad con el API (Fase 2).
 * Solo se muestra en pantallas técnicas (p. ej. login); no afecta el sitio comercial.
 */
export function ApiHealthBadge() {
  const baseUrl = getApiBaseUrl()
  const { data, error, isLoading, isSuccess, isError } = useApiHealth(Boolean(baseUrl))

  if (!baseUrl) {
    return (
      <p className="api-health api-health--warn" role="status">
        API: configure <code>VITE_API_URL</code> en el entorno.
      </p>
    )
  }

  if (isLoading) {
    return (
      <p className="api-health" role="status">
        API: comprobando conexión…
      </p>
    )
  }

  if (isSuccess) {
    const label =
      typeof data.status === 'string' ? data.status : 'ok'
    return (
      <p className="api-health api-health--ok" role="status">
        API: {label} ({baseUrl})
      </p>
    )
  }

  if (isError) {
    return (
      <p className="api-health api-health--error" role="status">
        API no disponible: {getHealthErrorMessage(error)}
      </p>
    )
  }

  return null
}
