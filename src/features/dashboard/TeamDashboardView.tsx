import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '../../components/feedback/QueryState'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { useTeamDashboard } from '../../hooks/useDashboard'
import { ApiError } from '../../types/api'
import { formatDate, formatLongDate, formatMinutes } from '../../utils'
import { statusLabels } from '../../utils/labels'

export function TeamDashboardView({ embedded = false }: { embedded?: boolean }) {
  const { data, isLoading, isError, error, refetch, isFetching } = useTeamDashboard(true)

  if (isLoading) {
    return <LoadingState label="Cargando dashboard del equipo…" />
  }

  if (isError || !data) {
    const message =
      error instanceof ApiError
        ? error.message
        : 'No se pudieron obtener los indicadores del equipo.'
    return <ErrorState message={message} onRetry={() => void refetch()} />
  }

  const maxCount = Math.max(...data.tasksByStatus.map((item) => item.count), 1)

  return (
    <div>
      {embedded ? null : (
        <PageHeader
          title="Equipo"
          description={`${formatLongDate(data.date)}. Resultados y avances del equipo (sin vigilancia invasiva).`}
        />
      )}

      {data.isDemoData ? (
        <p className="demo-inline" role="note">
          Indicadores DEMO temporales. Se reemplazarán por{' '}
          <code>GET /dashboard/team</code>.
        </p>
      ) : null}

      <div className="kpi-grid" aria-busy={isFetching}>
        <Card className="kpi-card">
          <span>Tareas vencidas</span>
          <strong className={data.overdueTasks > 0 ? 'kpi-text kpi-text--alert' : undefined}>
            {data.overdueTasks}
          </strong>
        </Card>
        <Card className="kpi-card">
          <span>Registros activos</span>
          <strong>{data.activeTimers}</strong>
          <em className="kpi-sub">Personas con temporizador en curso</em>
        </Card>
        <Card className="kpi-card">
          <span>Reportes enviados</span>
          <strong>{data.dailyReportsSubmitted}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Reportes pendientes</span>
          <strong
            className={
              data.dailyReportsPending > 0 ? 'kpi-text kpi-text--alert' : undefined
            }
          >
            {data.dailyReportsPending}
          </strong>
        </Card>
        <Card className="kpi-card">
          <span>Bloqueos informados</span>
          <strong>{data.blocks.length}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Próximos eventos</span>
          <strong>{data.upcomingEvents.length}</strong>
        </Card>
      </div>

      <div className="grid-2">
        <SectionCard title="Tareas por estado">
          <div className="bar-chart" aria-label="Distribución de tareas por estado">
            {data.tasksByStatus.map((item) => (
              <div className="bar-row" key={item.status}>
                <span className="bar-label">{statusLabels[item.status]}</span>
                <div className="bar-track" aria-hidden>
                  <div
                    className="bar-fill"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Horas del periodo por persona">
          {data.hoursByPerson.length === 0 ? (
            <EmptyState
              title="Sin horas registradas"
              description="Cuando el equipo registre tiempo verá el resumen aquí."
            />
          ) : (
            <ul className="dash-list">
              {data.hoursByPerson.map((person) => (
                <li key={person.userId}>
                  <strong>
                    {person.name}
                    {person.hasActiveTimer ? ' · activo' : ''}
                  </strong>
                  <span>{formatMinutes(person.minutes)}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Bloqueos informados">
          {data.blocks.length === 0 ? (
            <EmptyState title="Sin bloqueos informados" />
          ) : (
            <ul className="dash-list">
              {data.blocks.map((block) => (
                <li key={block.id}>
                  <strong>{block.title}</strong>
                  <span>{block.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Próximos eventos del equipo">
          {data.upcomingEvents.length === 0 ? (
            <EmptyState title="Sin eventos próximos" />
          ) : (
            <ul className="dash-list">
              {data.upcomingEvents.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong>
                  <span>
                    {formatDate(event.date)} · {event.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
