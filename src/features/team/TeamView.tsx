import { useState } from 'react'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '../../components/feedback/QueryState'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Table } from '../../components/ui/Table'
import { TeamDashboardView } from '../dashboard/TeamDashboardView'
import { ROLE_LABELS } from '../auth/permissions'
import { useTeamMembersQuery } from '../../hooks/useAdminData'
import { ApiError } from '../../types/api'
import { formatMinutes, startOfWeekISO, todayISO } from '../../utils'

function reportLabel(status: 'pending' | 'submitted' | 'not_required'): string {
  if (status === 'submitted') return 'Enviado'
  if (status === 'not_required') return 'No aplica'
  return 'Pendiente'
}

export function TeamView() {
  const [from, setFrom] = useState(startOfWeekISO())
  const [to, setTo] = useState(todayISO())
  const [tab, setTab] = useState<'members' | 'dashboard'>('members')
  const query = useTeamMembersQuery(from, to, tab === 'members')

  return (
    <div>
      <PageHeader
        title="Equipo"
        description="Integrantes, roles, tareas pendientes, horas del periodo y estado del reporte diario."
      />

      <div className="tabs-bar" role="tablist" aria-label="Vista de equipo">
        <button
          type="button"
          role="tab"
          className={tab === 'members' ? 'tab active' : 'tab'}
          aria-selected={tab === 'members'}
          onClick={() => setTab('members')}
        >
          Integrantes
        </button>
        <button
          type="button"
          role="tab"
          className={tab === 'dashboard' ? 'tab active' : 'tab'}
          aria-selected={tab === 'dashboard'}
          onClick={() => setTab('dashboard')}
        >
          Indicadores
        </button>
      </div>

      {tab === 'dashboard' ? <TeamDashboardView embedded /> : null}

      {tab === 'members' ? (
        <>
          {query.data?.isDemoData ? (
            <p className="demo-inline" role="note">
              Datos DEMO temporales. API prevista: <code>/team/members</code>.
            </p>
          ) : null}

          <Card style={{ marginBottom: '1rem' }}>
            <div className="filters-bar">
              <Input
                label="Desde"
                type="date"
                name="team-from"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
              <Input
                label="Hasta"
                type="date"
                name="team-to"
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />
            </div>
          </Card>

          {query.isLoading ? (
            <LoadingState label="Cargando integrantes…" />
          ) : query.isError ? (
            <ErrorState
              message={
                query.error instanceof ApiError
                  ? query.error.message
                  : 'No se pudo cargar el equipo.'
              }
              onRetry={() => void query.refetch()}
            />
          ) : (query.data?.members.length ?? 0) === 0 ? (
            <EmptyState title="No hay integrantes" />
          ) : (
            <SectionCard title="Integrantes del periodo">
              <Table
                rows={query.data?.members ?? []}
                rowKey={(row) => row.userId}
                columns={[
                  {
                    key: 'name',
                    header: 'Integrante',
                    render: (row) => (
                      <div>
                        <strong>{row.name}</strong>
                        <div style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>
                          {row.email}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'role',
                    header: 'Rol',
                    render: (row) => ROLE_LABELS[row.role],
                  },
                  {
                    key: 'status',
                    header: 'Estado',
                    render: (row) => (row.isActive ? 'Activo' : 'Inactivo'),
                  },
                  {
                    key: 'pending',
                    header: 'Tareas pendientes',
                    render: (row) => row.pendingTasks,
                  },
                  {
                    key: 'hours',
                    header: 'Horas del periodo',
                    render: (row) => formatMinutes(row.periodMinutes),
                  },
                  {
                    key: 'report',
                    header: 'Reporte diario',
                    render: (row) => (
                      <span
                        className={`kpi-text kpi-text--report-${
                          row.dailyReportStatus === 'submitted'
                            ? 'submitted'
                            : row.dailyReportStatus === 'pending'
                              ? 'pending'
                              : 'idle'
                        }`}
                      >
                        {reportLabel(row.dailyReportStatus)}
                      </span>
                    ),
                  },
                ]}
              />
            </SectionCard>
          )}
        </>
      ) : null}
    </div>
  )
}
