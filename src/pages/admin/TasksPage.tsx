import { useMemo, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { PriorityBadge } from '../../components/ui/StatusBadge'
import { priorityLabels, statusLabels } from '../../utils/labels'
import { Table } from '../../components/ui/Table'
import { Textarea } from '../../components/ui/Textarea'
import { assignees } from '../../data/tasks'
import { useTasks } from '../../hooks/useLocalData'
import type { Task, TaskPriority, TaskStatus } from '../../types'
import { formatDate } from '../../utils'

type TaskForm = Omit<Task, 'id'>

const emptyForm: TaskForm = {
  title: '',
  clientOrProject: '',
  assignee: assignees[0],
  priority: 'media',
  dueDate: '',
  status: 'pendiente',
  estimatedHours: 1,
  description: '',
}

export function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    status: '',
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TaskForm>(emptyForm)

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.assignee && task.assignee !== filters.assignee) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.status && task.status !== filters.status) return false
      return true
    })
  }, [filters, tasks])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingId(task.id)
    setForm({
      title: task.title,
      clientOrProject: task.clientOrProject,
      assignee: task.assignee,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
      estimatedHours: task.estimatedHours,
      description: task.description ?? '',
    })
    setModalOpen(true)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.clientOrProject.trim() || !form.dueDate) return

    if (editingId) {
      updateTask(editingId, form)
    } else {
      createTask(form)
    }
    setModalOpen(false)
  }

  const handleDelete = (task: Task) => {
    const confirmed = window.confirm(
      `¿Eliminar la tarea "${task.title}"? Esta acción solo afecta los datos locales de demostración.`,
    )
    if (confirmed) deleteTask(task.id)
  }

  return (
    <div>
      <PageHeader
        title="Gestión de tareas"
        description="Administre tareas locales de demostración con filtros y estados."
        actions={
          <Button onClick={openCreate}>Nueva tarea</Button>
        }
      />

      <Card style={{ marginBottom: '1rem' }}>
        <div className="filters-bar">
          <Select
            label="Responsable"
            name="filter-assignee"
            value={filters.assignee}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, assignee: event.target.value }))
            }
            options={[
              { value: '', label: 'Todos' },
              ...assignees.map((name) => ({ value: name, label: name })),
            ]}
          />
          <Select
            label="Prioridad"
            name="filter-priority"
            value={filters.priority}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, priority: event.target.value }))
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
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value }))
            }
            options={[
              { value: '', label: 'Todos' },
              ...Object.entries(statusLabels).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
        </div>
      </Card>

      <Table
        rows={filtered}
        rowKey={(row) => row.id}
        columns={[
          {
            key: 'title',
            header: 'Título',
            render: (row) => (
              <div>
                <strong>{row.title}</strong>
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
            render: (row) => <PriorityBadge priority={row.priority} />,
          },
          {
            key: 'dueDate',
            header: 'Fecha límite',
            render: (row) => formatDate(row.dueDate),
          },
          {
            key: 'status',
            header: 'Estado',
            render: (row) => (
              <Select
                label="Estado"
                name={`status-${row.id}`}
                value={row.status}
                aria-label={`Cambiar estado de ${row.title}`}
                onChange={(event) =>
                  updateTask(row.id, { status: event.target.value as TaskStatus })
                }
                options={Object.entries(statusLabels).map(([value, label]) => ({
                  value,
                  label,
                }))}
                className="inline-status"
              />
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
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>
                  Eliminar
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Editar tarea' : 'Nueva tarea'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="task-form">
              Guardar
            </Button>
          </>
        }
      >
        <form id="task-form" onSubmit={handleSubmit}>
          <Input
            label="Título"
            name="title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <Input
            label="Cliente o proyecto"
            name="clientOrProject"
            value={form.clientOrProject}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, clientOrProject: event.target.value }))
            }
            required
          />
          <Select
            label="Responsable"
            name="assignee"
            value={form.assignee}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, assignee: event.target.value }))
            }
            options={assignees.map((name) => ({ value: name, label: name }))}
          />
          <Select
            label="Prioridad"
            name="priority"
            value={form.priority}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                priority: event.target.value as TaskPriority,
              }))
            }
            options={Object.entries(priorityLabels).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Select
            label="Estado"
            name="status"
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                status: event.target.value as TaskStatus,
              }))
            }
            options={Object.entries(statusLabels).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Input
            label="Fecha límite"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, dueDate: event.target.value }))
            }
            required
          />
          <Input
            label="Tiempo estimado (horas)"
            name="estimatedHours"
            type="number"
            min={0.5}
            step={0.5}
            value={form.estimatedHours}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                estimatedHours: Number(event.target.value),
              }))
            }
            required
          />
          <Textarea
            label="Descripción"
            name="description"
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
          />
        </form>
      </Modal>
    </div>
  )
}
