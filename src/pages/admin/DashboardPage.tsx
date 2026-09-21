import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { dashboardBlocks, recentActivity } from '../../data/reports'
import { useAppointments, useTasks, useTimeEntries } from '../../hooks/useLocalData'
import { formatDate, formatMinutes, todayISO } from '../../utils'

export function DashboardPage() {
  const { tasks } = useTasks()
  const { appointments } = useAppointments()
  const { entries } = useTimeEntries()
  const today = todayISO()

  const pending = tasks.filter((task) => task.status !== 'terminada').length
  const done = tasks.filter((task) => task.status === 'terminada').length
  const supports = appointments.filter((item) => item.type === 'soporte').length
  const upcoming = appointments
    .filter((item) => item.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 4)
  const hoursToday = entries
    .filter((entry) => entry.date === today)
    .reduce((sum, entry) => sum + entry.totalMinutes, 0)

  const statusCounts = [
    'pendiente',
    'programada',
    'en_proceso',
    'esperando',
    'en_revision',
    'terminada',
  ].map((status) => ({
    label: status.replace('_', ' '),
    value: tasks.filter((task) => task.status === status).length,
  }))
  const maxCount = Math.max(...statusCounts.map((item) => item.value), 1)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen operativo del día con datos demostrativos."
      />

      <div className="kpi-grid">
        <Card className="kpi-card">
          <span>Tareas pendientes</span>
          <strong>{pending}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Tareas terminadas</span>
          <strong>{done}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Soportes registrados</span>
          <strong>{supports}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Horas del día</span>
          <strong>{formatMinutes(hoursToday)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Próximas actividades</span>
          <strong>{upcoming.length}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Bloqueos actuales</span>
          <strong>{dashboardBlocks.length}</strong>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <h2>Resumen del día</h2>
          <p>
            Hoy hay {upcoming.length} actividades próximas y {pending} tareas abiertas.
            El tiempo registrado en el día suma {formatMinutes(hoursToday)}.
          </p>
          <div className="bar-chart" aria-label="Distribución de tareas por estado">
            {statusCounts.map((item) => (
              <div className="bar-row" key={item.label}>
                <span className="bar-label">{item.label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(item.value / maxCount) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Próximas actividades</h2>
          <div className="stack-sm">
            {upcoming.length === 0 ? (
              <p className="empty-state">No hay actividades próximas.</p>
            ) : (
              upcoming.map((item) => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '0.65rem' }}>
                  <strong>{item.title}</strong>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                    {formatDate(item.date)} · {item.time} · {item.assignee}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2>Bloqueos actuales</h2>
          <div className="stack-sm">
            {dashboardBlocks.map((block) => (
              <div key={block.id}>
                <strong>{block.title}</strong>
                <div style={{ color: 'var(--color-gray-500)' }}>{block.detail}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Actividad reciente</h2>
          <div className="stack-sm">
            {recentActivity.map((item) => (
              <div key={item.id}>
                <div>{item.label}</div>
                <div style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: '1.25rem' }}>
        <h2>Tareas en seguimiento</h2>
        <div className="stack-sm">
          {tasks
            .filter((task) => task.status !== 'terminada')
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                    {task.clientOrProject} · {task.assignee}
                  </div>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
