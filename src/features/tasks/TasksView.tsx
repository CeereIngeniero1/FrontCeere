import { useMemo, useState } from 'react'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/feedback/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { PriorityBadge, StatusBadge } from '../../components/ui/StatusBadge'
import { Table } from '../../components/ui/Table'
import { useAuth } from '../../hooks/useAuth'
import { useTaskMutations, useTasksQuery } from '../../hooks/useTasksQuery'
import { ApiError } from '../../types/api'
import type { Task, TaskPriority, TaskStatus } from '../../types'
import type { TaskFilters } from '../../types/tasks'
import { formatDate, todayISO } from '../../utils'
import { priorityLabels, statusLabels } from '../../utils/labels'
import { DEMO_ASSIGNEES, isTaskOverdue } from './demoTasks'
import {
  canAssignTask,
  canCreateTask,
  canDeleteTask,
  canEditTask,
  scopeTasksForRole,
} from './permissions'
import { TaskFormModal } from './TaskFormModal'
import type { TaskFormValues } from './taskFormSchema'

const defaultForm = (assignee: string): TaskFormValues => ({
  title: '',
  clientOrProject: '',
  assignee,
  priority: 'media',
  dueDate: todayISO(),
  status: 'pendiente',
  estimatedHours: 1,
  description: '',
})

export function TasksView() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    assignee: '',
    priority: '',
    status: '',
    overdueOnly: false,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [formError, setFormError] = useState('')

  const queryFilters = useMemo(
    () => ({
      search: filters.search,
      assignee: canAssignTask(user?.role) ? filters.assignee : '',
      priority: filters.priority,
      status: filters.status,
      overdueOnly: filters.overdueOnly,
    }),
    [filters, user?.role],
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTasksQuery(queryFilters)
  const { createMutation, updateMutation, deleteMutation } = useTaskMutations()

  const assigneeOptions = useMemo(() => {
    const fromData = data?.items.map((task) => task.assignee) ?? []
    return [...new Set([...DEMO_ASSIGNEES, ...fromData, user?.name ?? ''].filter(Boolean))]
  }, [data?.items, user?.name])

  const visibleTasks = useMemo(
    () => scopeTasksForRole(data?.items ?? [], user?.role, user?.name),
    [data?.items, user?.name, user?.role],
  )

  const openCreate = () => {
    setEditing(null)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (values: TaskFormValues) => {
    setFormError('')
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: values })
      } else {
        await createMutation.mutateAsync(values)
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'No se pudo guardar la tarea.',
      )
    }
  }

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    if (!canEditTask(user?.role, task, user?.name)) return
    try {
      await updateMutation.mutateAsync({ id: task.id, payload: { status } })
    } catch {
      // El listado se refresca; el error se puede ver en estado de mutación.
    }
  }

  const handlePriorityChange = async (task: Task, priority: TaskPriority) => {
    if (!canEditTask(user?.role, task, user?.name)) return
    try {
      await updateMutation.mutateAsync({ id: task.id, payload: { priority } })
    } catch {
      // noop visual; reintento vía edición
    }
  }

  const handleDelete = async (task: Task) => {
    if (!canDeleteTask(user?.role)) return
    const confirmed = window.confirm(
      `¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    await deleteMutation.mutateAsync(task.id)
  }

  if (isLoading) {
    return <LoadingState label="Cargando tareas…" />
  }

  if (isError) {
    const message =
      error instanceof ApiError ? error.message : 'No se pudieron cargar las tareas.'
    return <ErrorState message={message} onRetry={() => void refetch()} />
  }

  const initialValues: TaskFormValues = editing
    ? {
        title: editing.title,
        clientOrProject: editing.clientOrProject,
        assignee: editing.assignee,
        priority: editing.priority,
        dueDate: editing.dueDate,
        status: editing.status,
        estimatedHours: editing.estimatedHours,
        description: editing.description ?? '',
      }
    : defaultForm(
        canAssignTask(user?.role) ? (user?.name ?? DEMO_ASSIGNEES[0]) : (user?.name ?? ''),
      )

  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Liste, filtre, asigne y actualice el estado de las tareas del equipo."
        actions={
          canCreateTask(user?.role) ? (
            <Button onClick={openCreate}>Nueva tarea</Button>
          ) : null
        }
      />

      {data?.isDemoData ? (
        <p className="demo-inline" role="note">
          Datos DEMO temporales (LocalStorage). Contrato API: <code>GET/POST/PATCH/DELETE /tasks</code>.
        </p>
      ) : null}

      <Card style={{ marginBottom: '1rem' }} aria-busy={isFetching}>
        <div className="filters-bar">
          <Input
            label="Buscar"
            name="search"
            placeholder="Título, cliente, responsable…"
            value={filters.search ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, search: event.target.value }))
            }
          />
          {canAssignTask(user?.role) ? (
            <Select
              label="Responsable"
              name="filter-assignee"
              value={filters.assignee ?? ''}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, assignee: event.target.value }))
              }
              options={[
                { value: '', label: 'Todos' },
                ...assigneeOptions.map((name) => ({ value: name, label: name })),
              ]}
            />
          ) : null}
          <Select
            label="Prioridad"
            name="filter-priority"
            value={filters.priority ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                priority: event.target.value as TaskPriority | '',
              }))
            }
            options={[
              { value: '', label: 'Todas' },
              ...Object.entries(priorityLabels).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <Select
            label="Estado"
            name="filter-status"
            value={filters.status ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                status: event.target.value as TaskStatus | '',
              }))
            }
            options={[
              { value: '', label: 'Todos' },
              ...Object.entries(statusLabels).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <label className="filter-check">
            <input
              type="checkbox"
              checked={Boolean(filters.overdueOnly)}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  overdueOnly: event.target.checked,
                }))
              }
            />
            Solo vencidas
          </label>
        </div>
      </Card>

      {visibleTasks.length === 0 ? (
        <EmptyState
          title="No hay tareas"
          description="Ajuste los filtros o cree una nueva tarea."
        />
      ) : (
        <Table
          rows={visibleTasks}
          rowKey={(row) => row.id}
          rowClassName={(row) => (isTaskOverdue(row) ? 'row-overdue' : undefined)}
          columns={[
            {
              key: 'title',
              header: 'Título',
              render: (row) => (
                <div>
                  <strong>{row.title}</strong>
                  {isTaskOverdue(row) ? (
                    <span className="overdue-tag" aria-label="Tarea vencida">
                      Vencida
                    </span>
                  ) : null}
                  {row.description ? (
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>
                      {row.description}
                    </div>
                  ) : null}
                </div>
              ),
            },
            {
              key: 'client',
              header: 'Cliente / proyecto',
              render: (row) => row.clientOrProject,
            },
            {
              key: 'assignee',
              header: 'Responsable',
              render: (row) => row.assignee,
            },
            {
              key: 'priority',
              header: 'Prioridad',
              render: (row) =>
                canEditTask(user?.role, row, user?.name) ? (
                  <Select
                    label="Prioridad"
                    name={`priority-${row.id}`}
                    value={row.priority}
                    aria-label={`Cambiar prioridad de ${row.title}`}
                    className="inline-status"
                    onChange={(event) =>
                      void handlePriorityChange(
                        row,
                        event.target.value as TaskPriority,
                      )
                    }
                    options={Object.entries(priorityLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                ) : (
                  <PriorityBadge priority={row.priority} />
                ),
            },
            {
              key: 'dueDate',
              header: 'Fecha límite',
              render: (row) => (
                <span className={isTaskOverdue(row) ? 'due-overdue' : undefined}>
                  {formatDate(row.dueDate)}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Estado',
              render: (row) =>
                canEditTask(user?.role, row, user?.name) ? (
                  <Select
                    label="Estado"
                    name={`status-${row.id}`}
                    value={row.status}
                    aria-label={`Cambiar estado de ${row.title}`}
                    className="inline-status"
                    onChange={(event) =>
                      void handleStatusChange(row, event.target.value as TaskStatus)
                    }
                    options={Object.entries(statusLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                ) : (
                  <StatusBadge status={row.status} />
                ),
            },
            {
              key: 'hours',
              header: 'Estimado',
              render: (row) => `${row.estimatedHours} h`,
            },
            {
              key: 'actions',
              header: 'Acciones',
              render: (row) => (
                <div className="inline-actions">
                  {canEditTask(user?.role, row, user?.name) ? (
                    <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                      Editar
                    </Button>
                  ) : null}
                  {canDeleteTask(user?.role) ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => void handleDelete(row)}
                      disabled={deleteMutation.isPending}
                    >
                      Eliminar
                    </Button>
                  ) : null}
                </div>
              ),
            },
          ]}
        />
      )}

      <TaskFormModal
        open={modalOpen}
        title={editing ? 'Editar tarea' : 'Nueva tarea'}
        initialValues={initialValues}
        assigneeOptions={assigneeOptions}
        canAssign={canAssignTask(user?.role)}
        submitting={createMutation.isPending || updateMutation.isPending}
        errorMessage={formError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  )
}
