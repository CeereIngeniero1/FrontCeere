import { Link } from 'react-router-dom'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '../../components/feedback/QueryState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { usePersonalDashboard } from '../../hooks/useDashboard'
import { ApiError } from '../../types/api'
import type {
  DailyReportStatus,
  TimeTrackingStatus,
} from '../../types/dashboard'
import { formatLongDate, formatMinutes, formatDate } from '../../utils'
import { statusLabels } from '../../utils/labels'

function timeStatusLabel(status: TimeTrackingStatus): string {
  switch (status) {
    case 'running':
      return 'Actividad en curso'
    case 'paused':
      return 'Actividad en pausa'
    default:
      return 'Sin actividad activa'
  }
}

function reportStatusLabel(status: DailyReportStatus): string {
  switch (status) {
    case 'submitted':
      return 'Enviado'
    case 'not_required':
      return 'No requerido'
    default:
      return 'Pendiente'
  }
}

export function PersonalDashboardView() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePersonalDashboard()

  if (isLoading) {
    return <LoadingState label="Cargando dashboard personal…" />
  }

  if (isError || !data) {
    const message =
      error instanceof ApiError
        ? error.message
        : 'No se pudieron obtener los indicadores personales.'
    return <ErrorState message={message} onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title={`Hola, ${data.userName}`}
        description={`${formatLongDate(data.date)}. Resumen de tu jornada y avances.`}
      />

      {data.isDemoData ? (
        <p className="demo-inline" role="note">
          Indicadores DEMO temporales (LocalStorage / seeds). Se reemplazarán por{' '}
          <code>GET /dashboard/me</code>.
        </p>
      ) : null}

      <div className="kpi-grid" aria-busy={isFetching}>
        <Card className="kpi-card">
          <span>Registro de tiempo</span>
          <strong className={`kpi-text kpi-text--${data.timeTrackingStatus}`}>
            {timeStatusLabel(data.timeTrackingStatus)}
          </strong>
          {data.activeActivityLabel ? (
            <em className="kpi-sub">{data.activeActivityLabel}</em>
          ) : null}
        </Card>
        <Card className="kpi-card">
          <span>Tareas pendientes</span>
          <strong>{data.pendingTasks}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Tareas vencidas</span>
          <strong
            className={data.overdueTasks > 0 ? 'kpi-text kpi-text--alert' : undefined}
            aria-label={
              data.overdueTasks > 0
                ? `${data.overdueTasks} tareas vencidas`
                : 'Sin tareas vencidas'
            }
          >
            {data.overdueTasks}
          </strong>
        </Card>
        <Card className="kpi-card">
          <span>Horas hoy</span>
          <strong>{formatMinutes(data.hoursTodayMinutes)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Horas esta semana</span>
          <strong>{formatMinutes(data.hoursWeekMinutes)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Reporte diario</span>
          <strong className={`kpi-text kpi-text--report-${data.dailyReportStatus}`}>
            {reportStatusLabel(data.dailyReportStatus)}
          </strong>
          <Link className="kpi-link" to="/app/reporte-diario">
            Ir al reporte
          </Link>
        </Card>
      </div>

      <div className="grid-2">
        <SectionCard title="Próximos eventos">
          {data.upcomingEvents.length === 0 ? (
            <EmptyState
              title="Sin eventos próximos"
              description="Cuando haya citas en la agenda aparecerán aquí."
            />
          ) : (
            <ul className="dash-list">
              {data.upcomingEvents.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong>
                  <span>
                    {formatDate(event.date)} · {event.time}
                    {event.type ? ` · ${event.type}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Bloqueos registrados">
          {data.blocks.length === 0 ? (
            <EmptyState
              title="Sin bloqueos"
              description="No hay impedimentos informados para hoy."
            />
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
      </div>

      <SectionCard title="Tareas abiertas">
        {data.openTasks.length === 0 ? (
          <EmptyState
            title="No hay tareas abiertas"
            description="Buen avance: no tienes pendientes en seguimiento."
          />
        ) : (
          <ul className="dash-task-list">
            {data.openTasks.map((task) => (
              <li
                key={task.id}
                className={task.overdue ? 'dash-task dash-task--overdue' : 'dash-task'}
              >
                <div>
                  <strong>{task.title}</strong>
                  <span>
                    {task.clientOrProject ? `${task.clientOrProject} · ` : ''}
                    Vence {formatDate(task.dueDate)}
                    {task.overdue ? ' · Vencida' : ''}
                  </span>
                </div>
                <StatusBadge status={task.status} />
                <span className="sr-only">
                  Estado: {statusLabels[task.status]}
                  {task.overdue ? ', vencida' : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
