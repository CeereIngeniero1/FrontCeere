import { useState } from 'react'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '../../components/feedback/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Table } from '../../components/ui/Table'
import { useReportsSummaryQuery } from '../../hooks/useAdminData'
import { ApiError } from '../../types/api'
import { downloadCsv, formatMinutes, startOfWeekISO, todayISO } from '../../utils'

export function ReportsView() {
  const [from, setFrom] = useState(startOfWeekISO())
  const [to, setTo] = useState(todayISO())
  const query = useReportsSummaryQuery({ from, to })

  const exportCsv = () => {
    if (!query.data) return
    const rows: string[][] = [
      ['Métrica', 'Valor'],
      ['Desde', query.data.from],
      ['Hasta', query.data.to],
      ['Tareas completadas', String(query.data.tasksCompleted)],
      ['Tareas vencidas', String(query.data.tasksOverdue)],
      [
        'Reportes diarios enviados',
        String(query.data.dailyReportsSubmitted),
      ],
      [
        'Reportes diarios esperados',
        String(query.data.dailyReportsExpected),
      ],
      [],
      ['Usuario', 'Minutos'],
      ...query.data.hoursByUser.map((row) => [row.name, String(row.minutes)]),
      [],
      ['Categoría', 'Minutos'],
      ...query.data.hoursByCategory.map((row) => [
        row.category,
        String(row.minutes),
      ]),
      [],
      ['Bloqueo', 'Detalle'],
      ...query.data.blocks.map((row) => [row.title, row.detail]),
    ]
    downloadCsv(`reporte-ceere-${todayISO()}.csv`, rows)
  }

  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Indicadores por rango de fechas. La exportación a Excel queda para una segunda versión; por ahora hay CSV."
        actions={
          <Button type="button" onClick={exportCsv} disabled={!query.data}>
            Exportar CSV
          </Button>
        }
      />

      <Card style={{ marginBottom: '1rem' }}>
        <div className="filters-bar">
          <Input
            label="Desde"
            type="date"
            name="reports-from"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          <Input
            label="Hasta"
            type="date"
            name="reports-to"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
      </Card>

      {query.isLoading ? <LoadingState label="Calculando reportes…" /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : 'No se pudieron cargar los reportes.'
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.data ? (
        <>
          {query.data.isDemoData ? (
            <p className="demo-inline" role="note">
              Datos DEMO temporales. API prevista: <code>/reports/summary</code>.
            </p>
          ) : null}

          <div className="kpi-grid">
            <Card className="kpi-card">
              <span>Tareas completadas</span>
              <strong>{query.data.tasksCompleted}</strong>
            </Card>
            <Card className="kpi-card">
              <span>Tareas vencidas</span>
              <strong className="kpi-text kpi-text--alert">
                {query.data.tasksOverdue}
              </strong>
            </Card>
            <Card className="kpi-card">
              <span>Reportes enviados</span>
              <strong>{query.data.dailyReportsSubmitted}</strong>
            </Card>
            <Card className="kpi-card">
              <span>Cumplimiento reportes</span>
              <strong>
                {query.data.dailyReportsExpected === 0
                  ? '—'
                  : `${Math.min(
                      100,
                      Math.round(
                        (query.data.dailyReportsSubmitted /
                          query.data.dailyReportsExpected) *
                          100,
                      ),
                    )}%`}
              </strong>
            </Card>
          </div>

          <div className="grid-2">
            <SectionCard title="Horas por usuario">
              {query.data.hoursByUser.length === 0 ? (
                <EmptyState title="Sin horas en el periodo" />
              ) : (
                <Table
                  rows={query.data.hoursByUser}
                  rowKey={(row) => row.userId}
                  columns={[
                    {
                      key: 'name',
                      header: 'Usuario',
                      render: (row) => row.name,
                    },
                    {
                      key: 'minutes',
                      header: 'Horas',
                      render: (row) => formatMinutes(row.minutes),
                    },
                  ]}
                />
              )}
            </SectionCard>

            <SectionCard title="Horas por categoría">
              {query.data.hoursByCategory.length === 0 ? (
                <EmptyState title="Sin categorías en el periodo" />
              ) : (
                <Table
                  rows={query.data.hoursByCategory}
                  rowKey={(row) => row.category}
                  columns={[
                    {
                      key: 'category',
                      header: 'Categoría',
                      render: (row) => row.category,
                    },
                    {
                      key: 'minutes',
                      header: 'Horas',
                      render: (row) => formatMinutes(row.minutes),
                    },
                  ]}
                />
              )}
            </SectionCard>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <SectionCard title="Bloqueos registrados">
              {query.data.blocks.length === 0 ? (
                <EmptyState title="Sin bloqueos en el periodo" />
              ) : (
                <ul className="dash-list">
                  {query.data.blocks.map((block) => (
                    <li key={block.id}>
                      <strong>{block.title}</strong>
                      <span>{block.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        </>
      ) : null}
    </div>
  )
}
