import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '../../components/feedback/QueryState'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Textarea } from '../../components/ui/Textarea'
import { canManageAllTasks } from '../tasks/permissions'
import { useAuth } from '../../hooks/useAuth'
import {
  useMyDailyReports,
  useSaveDailyReport,
  useTeamDailyReports,
  useTodayDailyReport,
} from '../../hooks/useDailyReports'
import { ApiError } from '../../types/api'
import type { DailyReport } from '../../types/daily-reports'
import { formatDate, formatLongDate } from '../../utils'
import {
  dailyReportSchema,
  type DailyReportFormInput,
  type DailyReportFormValues,
} from './dailyReportSchema'

function ReportCard({ report, showAuthor }: { report: DailyReport; showAuthor?: boolean }) {
  return (
    <article className="report-card">
      <header>
        <strong>
          {showAuthor ? `${report.userName} · ` : null}
          {formatDate(report.date)}
        </strong>
        <span>
          Enviado {new Date(report.submittedAt).toLocaleString('es-CO')}
          {report.updatedAt !== report.submittedAt
            ? ` · editado ${new Date(report.updatedAt).toLocaleString('es-CO')}`
            : ''}
        </span>
      </header>
      <dl className="report-fields">
        <div>
          <dt>¿Qué completaste hoy?</dt>
          <dd>{report.completed}</dd>
        </div>
        <div>
          <dt>¿Qué quedó pendiente?</dt>
          <dd>{report.pending}</dd>
        </div>
        <div>
          <dt>¿Tienes algún bloqueo?</dt>
          <dd>{report.blockers}</dd>
        </div>
        {report.notes ? (
          <div>
            <dt>Observaciones adicionales</dt>
            <dd>{report.notes}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  )
}

export function DailyReportView() {
  const { user } = useAuth()
  const canViewTeam = canManageAllTasks(user?.role)
  const [tab, setTab] = useState<'mine' | 'team'>('mine')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const todayQuery = useTodayDailyReport()
  const myQuery = useMyDailyReports()
  const teamQuery = useTeamDailyReports(canViewTeam && tab === 'team')
  const saveMutation = useSaveDailyReport()

  const existing = todayQuery.data?.report ?? null

  const form = useForm<DailyReportFormInput, unknown, DailyReportFormValues>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      completed: '',
      pending: '',
      blockers: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (!existing) {
      form.reset({ completed: '', pending: '', blockers: '', notes: '' })
      return
    }
    form.reset({
      completed: existing.completed,
      pending: existing.pending,
      blockers: existing.blockers,
      notes: existing.notes,
    })
  }, [existing, form])

  const status = todayQuery.data?.status ?? 'pending'
  const history = useMemo(() => myQuery.data?.items ?? [], [myQuery.data?.items])
  const teamItems = useMemo(
    () => teamQuery.data?.items ?? [],
    [teamQuery.data?.items],
  )

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError('')
    setFormSuccess('')
    try {
      await saveMutation.mutateAsync({
        payload: {
          completed: values.completed,
          pending: values.pending,
          blockers: values.blockers,
          notes: values.notes,
        },
        existingId: existing?.id,
      })
      setFormSuccess(
        existing ? 'Reporte del día actualizado.' : 'Reporte del día enviado.',
      )
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el reporte diario.',
      )
    }
  })

  if (todayQuery.isLoading) {
    return <LoadingState label="Cargando reporte diario…" />
  }

  if (todayQuery.isError || !todayQuery.data) {
    const message =
      todayQuery.error instanceof ApiError
        ? todayQuery.error.message
        : 'No se pudo cargar el reporte del día.'
    return <ErrorState message={message} onRetry={() => void todayQuery.refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Reporte diario"
        description={`${formatLongDate(todayQuery.data.date)}. Comparta avances, pendientes y bloqueos del día.`}
      />

      {todayQuery.data.isDemoData ? (
        <p className="demo-inline" role="note">
          Datos DEMO temporales. API prevista: <code>/daily-reports/today|me|team</code>.
        </p>
      ) : null}

      <div className="kpi-grid">
        <Card className="kpi-card">
          <span>Estado de hoy</span>
          <strong
            className={`kpi-text kpi-text--report-${status}`}
            aria-label={
              status === 'submitted'
                ? 'Reporte del día enviado'
                : 'Reporte del día pendiente'
            }
          >
            {status === 'submitted' ? 'Enviado' : 'Pendiente'}
          </strong>
        </Card>
        <Card className="kpi-card">
          <span>Reportes propios</span>
          <strong>{history.length}</strong>
        </Card>
        {canViewTeam ? (
          <Card className="kpi-card">
            <span>Reportes del equipo (vista)</span>
            <strong>{teamItems.length || '—'}</strong>
          </Card>
        ) : null}
      </div>

      <SectionCard
        title={existing ? 'Editar reporte de hoy' : 'Crear reporte de hoy'}
      >
        {status === 'pending' ? (
          <Alert variant="warning" title="Pendiente de envío">
            Aún no ha enviado el reporte de hoy.
          </Alert>
        ) : (
          <Alert variant="success" title="Reporte enviado">
            Puede editarlo si necesita corregir información.
          </Alert>
        )}

        {formError ? <Alert variant="error">{formError}</Alert> : null}
        {formSuccess ? <Alert variant="success">{formSuccess}</Alert> : null}

        <form className="daily-report-form" onSubmit={(e) => void onSubmit(e)} noValidate>
          <Textarea
            label="¿Qué completaste hoy?"
            rows={4}
            {...form.register('completed')}
            error={form.formState.errors.completed?.message}
            required
          />
          <Textarea
            label="¿Qué quedó pendiente?"
            rows={3}
            {...form.register('pending')}
            error={form.formState.errors.pending?.message}
            required
          />
          <Textarea
            label="¿Tienes algún bloqueo?"
            rows={3}
            {...form.register('blockers')}
            error={form.formState.errors.blockers?.message}
            required
          />
          <Textarea
            label="Observaciones adicionales"
            rows={3}
            {...form.register('notes')}
          />
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending
              ? 'Guardando…'
              : existing
                ? 'Actualizar reporte'
                : 'Enviar reporte'}
          </Button>
        </form>
      </SectionCard>

      <div style={{ marginTop: '1.25rem' }}>
        <div className="tabs-bar" role="tablist" aria-label="Historial de reportes">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'mine'}
            className={tab === 'mine' ? 'tab active' : 'tab'}
            onClick={() => setTab('mine')}
          >
            Mis reportes
          </button>
          {canViewTeam ? (
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'team'}
              className={tab === 'team' ? 'tab active' : 'tab'}
              onClick={() => setTab('team')}
            >
              Equipo
            </button>
          ) : null}
        </div>

        {tab === 'mine' ? (
          myQuery.isLoading ? (
            <LoadingState label="Cargando historial…" />
          ) : history.length === 0 ? (
            <EmptyState
              title="Sin reportes anteriores"
              description="Cuando envíe reportes aparecerán aquí."
            />
          ) : (
            <div className="report-list">
              {history.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )
        ) : teamQuery.isLoading ? (
          <LoadingState label="Cargando reportes del equipo…" />
        ) : teamQuery.isError ? (
          <ErrorState
            message={
              teamQuery.error instanceof ApiError
                ? teamQuery.error.message
                : 'No se pudieron cargar los reportes del equipo.'
            }
            onRetry={() => void teamQuery.refetch()}
          />
        ) : teamItems.length === 0 ? (
          <EmptyState title="El equipo aún no tiene reportes" />
        ) : (
          <div className="report-list">
            {teamItems.map((report) => (
              <ReportCard key={report.id} report={report} showAuthor />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
