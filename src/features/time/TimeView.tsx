import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
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
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Table } from '../../components/ui/Table'
import { Textarea } from '../../components/ui/Textarea'
import { useTasksQuery } from '../../hooks/useTasksQuery'
import { useTimeMutations, useTimeSummaryQuery } from '../../hooks/useTimeQuery'
import { ApiError } from '../../types/api'
import {
  TIME_CATEGORIES,
  timeCategoryLabels,
  type TimeCategory,
} from '../../types/time'
import { formatDate, formatMinutes, todayISO } from '../../utils'
import {
  manualTimeSchema,
  startTimerSchema,
  type ManualTimeInput,
  type ManualTimeValues,
  type StartTimerInput,
  type StartTimerValues,
} from './timeFormSchema'
import { useElapsedTimer } from './useElapsedTimer'

export function TimeView() {
  const summaryQuery = useTimeSummaryQuery()
  const tasksQuery = useTasksQuery({ status: '' })
  const { startMutation, stopMutation, createMutation, deleteMutation } =
    useTimeMutations()

  const [manualOpen, setManualOpen] = useState(false)
  const [actionError, setActionError] = useState('')

  const active = summaryQuery.data?.activeTimer ?? null
  const { label: elapsedLabel } = useElapsedTimer(active?.startedAt)

  const openTasks = useMemo(
    () =>
      (tasksQuery.data?.items ?? []).filter((task) => task.status !== 'terminada'),
    [tasksQuery.data?.items],
  )

  const taskOptions = [
    { value: '', label: 'Sin tarea vinculada' },
    ...openTasks.map((task) => ({
      value: task.id,
      label: `${task.title} (${task.clientOrProject})`,
    })),
  ]

  const categoryOptions = TIME_CATEGORIES.map((value) => ({
    value,
    label: timeCategoryLabels[value],
  }))

  const startForm = useForm<StartTimerInput, unknown, StartTimerValues>({
    resolver: zodResolver(startTimerSchema),
    defaultValues: {
      taskId: '',
      category: 'soporte',
      description: '',
    },
  })

  const manualForm = useForm<ManualTimeInput, unknown, ManualTimeValues>({
    resolver: zodResolver(manualTimeSchema),
    defaultValues: {
      taskId: '',
      category: 'soporte',
      description: '',
      date: todayISO(),
      startTime: '08:00',
      endTime: '09:00',
      notes: '',
    },
  })

  const handleStart = startForm.handleSubmit(async (values) => {
    setActionError('')
    try {
      await startMutation.mutateAsync({
        taskId: values.taskId || null,
        category: values.category as TimeCategory,
        description: values.description,
      })
      startForm.reset({ taskId: '', category: 'soporte', description: '' })
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'No se pudo iniciar la actividad.',
      )
    }
  })

  const handleStop = async () => {
    setActionError('')
    try {
      await stopMutation.mutateAsync()
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'No se pudo detener la actividad.',
      )
    }
  }

  const handleManual = manualForm.handleSubmit(async (values) => {
    setActionError('')
    try {
      await createMutation.mutateAsync({
        taskId: values.taskId || null,
        category: values.category as TimeCategory,
        description: values.description,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        notes: values.notes,
      })
      setManualOpen(false)
      manualForm.reset({
        taskId: '',
        category: 'soporte',
        description: '',
        date: todayISO(),
        startTime: '08:00',
        endTime: '09:00',
        notes: '',
      })
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'No se pudo guardar el registro.',
      )
    }
  })

  if (summaryQuery.isLoading) {
    return <LoadingState label="Cargando registro de tiempo…" />
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    const message =
      summaryQuery.error instanceof ApiError
        ? summaryQuery.error.message
        : 'No se pudo cargar el resumen de tiempo.'
    return (
      <ErrorState message={message} onRetry={() => void summaryQuery.refetch()} />
    )
  }

  const data = summaryQuery.data
  const maxCat = Math.max(...data.byCategory.map((c) => c.minutes), 1)
  const history = data.entriesWeek

  return (
    <div>
      <PageHeader
        title="Registro de tiempo"
        description="Inicie o detenga actividades y registre tiempo manual. El temporizador es informativo; la duración oficial la calcula el servidor al detener."
        actions={
          <Button type="button" onClick={() => setManualOpen(true)}>
            Registro manual
          </Button>
        }
      />

      {data.isDemoData ? (
        <p className="demo-inline" role="note">
          Datos DEMO temporales. API prevista: <code>/time/summary</code>,{' '}
          <code>/time/timer/start|stop</code>, <code>/time/entries</code>.
        </p>
      ) : null}

      {actionError ? (
        <Alert variant="error">{actionError}</Alert>
      ) : null}

      <div className="kpi-grid">
        <Card className="kpi-card">
          <span>Hoy</span>
          <strong>{formatMinutes(data.todayMinutes)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Esta semana</span>
          <strong>{formatMinutes(data.weekMinutes)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Estado</span>
          <strong className={`kpi-text kpi-text--${active ? 'running' : 'idle'}`}>
            {active ? 'En curso' : 'Sin actividad'}
          </strong>
        </Card>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <SectionCard title="Temporizador">
          {active ? (
            <div className="timer-panel" role="status" aria-live="polite">
              <div className="timer-display" aria-label={`Tiempo transcurrido ${elapsedLabel}`}>
                {elapsedLabel}
              </div>
              <p className="timer-meta">
                <strong>{active.description}</strong>
                <span>
                  {timeCategoryLabels[active.category]}
                  {active.taskTitle ? ` · ${active.taskTitle}` : ''}
                </span>
                <span className="timer-note">
                  Vista informativa. Al detener, el backend fija la duración oficial.
                </span>
              </p>
              <Button
                type="button"
                variant="danger"
                onClick={() => void handleStop()}
                disabled={stopMutation.isPending}
              >
                {stopMutation.isPending ? 'Deteniendo…' : 'Detener actividad'}
              </Button>
            </div>
          ) : (
            <form className="timer-form" onSubmit={(e) => void handleStart(e)} noValidate>
              <Select
                label="Tarea"
                {...startForm.register('taskId')}
                options={taskOptions}
              />
              <Select
                label="Categoría"
                {...startForm.register('category')}
                error={startForm.formState.errors.category?.message}
                options={categoryOptions}
              />
              <Textarea
                label="Descripción"
                {...startForm.register('description')}
                error={startForm.formState.errors.description?.message}
              />
              <Button type="submit" disabled={startMutation.isPending}>
                {startMutation.isPending ? 'Iniciando…' : 'Iniciar actividad'}
              </Button>
            </form>
          )}
        </SectionCard>

        <SectionCard title="Resumen semanal por categoría">
          {data.byCategory.length === 0 ? (
            <EmptyState
              title="Sin horas esta semana"
              description="Al registrar tiempo verá la distribución aquí."
            />
          ) : (
            <div className="bar-chart" aria-label="Horas por categoría">
              {data.byCategory.map((item) => (
                <div className="bar-row" key={item.category}>
                  <span className="bar-label">
                    {timeCategoryLabels[item.category as keyof typeof timeCategoryLabels] ??
                      item.category}
                  </span>
                  <div className="bar-track" aria-hidden>
                    <div
                      className="bar-fill"
                      style={{ width: `${(item.minutes / maxCat) * 100}%` }}
                    />
                  </div>
                  <span className="bar-value">{formatMinutes(item.minutes)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Historial del día">
        {data.entriesToday.length === 0 ? (
          <EmptyState title="Sin registros hoy" />
        ) : (
          <ul className="dash-list">
            {data.entriesToday.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.activity}</strong>
                <span>
                  {entry.startTime} – {entry.endTime} · {formatMinutes(entry.totalMinutes)} ·{' '}
                  {entry.project}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div style={{ marginTop: '1.25rem' }}>
        <SectionCard title="Historial semanal">
          {history.length === 0 ? (
            <EmptyState title="Sin registros en la semana" />
          ) : (
            <Table
              rows={history}
              rowKey={(row) => row.id}
              columns={[
                {
                  key: 'activity',
                  header: 'Actividad',
                  render: (row) => row.activity,
                },
                {
                  key: 'category',
                  header: 'Categoría / proyecto',
                  render: (row) =>
                    ('category' in row && row.category
                      ? timeCategoryLabels[
                          row.category as keyof typeof timeCategoryLabels
                        ] ?? String(row.category)
                      : null) || row.project,
                },
                {
                  key: 'date',
                  header: 'Fecha',
                  render: (row) => formatDate(row.date),
                },
                {
                  key: 'range',
                  header: 'Horario',
                  render: (row) => `${row.startTime} – ${row.endTime}`,
                },
                {
                  key: 'total',
                  header: 'Total',
                  render: (row) => formatMinutes(row.totalMinutes),
                },
                {
                  key: 'actions',
                  header: 'Acciones',
                  render: (row) => (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar el registro "${row.activity}"?`,
                          )
                        ) {
                          void deleteMutation.mutateAsync(row.id)
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </SectionCard>
      </div>

      <Modal
        open={manualOpen}
        title="Registro manual de tiempo"
        onClose={() => setManualOpen(false)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setManualOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="manual-time-form"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Guardando…' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form
          id="manual-time-form"
          onSubmit={(e) => void handleManual(e)}
          noValidate
        >
          <Select
            label="Tarea"
            {...manualForm.register('taskId')}
            options={taskOptions}
          />
          <Select
            label="Categoría"
            {...manualForm.register('category')}
            error={manualForm.formState.errors.category?.message}
            options={categoryOptions}
          />
          <Input
            label="Descripción"
            {...manualForm.register('description')}
            error={manualForm.formState.errors.description?.message}
            required
          />
          <Input
            label="Fecha"
            type="date"
            {...manualForm.register('date')}
            error={manualForm.formState.errors.date?.message}
            required
          />
          <Input
            label="Hora de inicio"
            type="time"
            {...manualForm.register('startTime')}
            error={manualForm.formState.errors.startTime?.message}
            required
          />
          <Input
            label="Hora de finalización"
            type="time"
            {...manualForm.register('endTime')}
            error={manualForm.formState.errors.endTime?.message}
            required
          />
          <Textarea label="Observaciones" {...manualForm.register('notes')} />
        </form>
      </Modal>
    </div>
  )
}
