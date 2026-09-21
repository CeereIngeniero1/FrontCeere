import { useMemo, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Table } from '../../components/ui/Table'
import { Textarea } from '../../components/ui/Textarea'
import { projects } from '../../data/timeEntries'
import { useTimeEntries } from '../../hooks/useLocalData'
import type { TimeEntry } from '../../types'
import {
  formatDate,
  formatMinutes,
  minutesBetween,
  startOfWeekISO,
  todayISO,
} from '../../utils'

type TimeForm = Omit<TimeEntry, 'id' | 'totalMinutes'>

const emptyForm: TimeForm = {
  activity: '',
  project: projects[0],
  date: todayISO(),
  startTime: '08:00',
  endTime: '09:00',
  notes: '',
}

export function TimePage() {
  const { entries, createEntry, deleteEntry } = useTimeEntries()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<TimeForm>(emptyForm)
  const [error, setError] = useState('')

  const today = todayISO()
  const weekStart = startOfWeekISO()

  const todayTotal = entries
    .filter((entry) => entry.date === today)
    .reduce((sum, entry) => sum + entry.totalMinutes, 0)

  const weekTotal = entries
    .filter((entry) => entry.date >= weekStart && entry.date <= today)
    .reduce((sum, entry) => sum + entry.totalMinutes, 0)

  const byProject = useMemo(() => {
    const map = new Map<string, number>()
    entries.forEach((entry) => {
      map.set(entry.project, (map.get(entry.project) ?? 0) + entry.totalMinutes)
    })
    return Array.from(map.entries())
      .map(([project, minutes]) => ({ project, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
  }, [entries])

  const maxMinutes = Math.max(...byProject.map((item) => item.minutes), 1)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const total = minutesBetween(form.startTime, form.endTime)
    if (!form.activity.trim()) {
      setError('Indique la actividad.')
      return
    }
    if (total <= 0) {
      setError('La hora de finalización debe ser posterior a la de inicio.')
      return
    }

    createEntry({
      ...form,
      totalMinutes: total,
    })
    setModalOpen(false)
    setForm(emptyForm)
    setError('')
  }

  return (
    <div>
      <PageHeader
        title="Gestión de tiempo"
        description="Registro manual de tiempo. No incluye vigilancia ni capturas de actividad."
        actions={<Button onClick={() => setModalOpen(true)}>Registrar tiempo</Button>}
      />

      <div className="kpi-grid">
        <Card className="kpi-card">
          <span>Total del día</span>
          <strong>{formatMinutes(todayTotal)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Total semanal</span>
          <strong>{formatMinutes(weekTotal)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Registros</span>
          <strong>{entries.length}</strong>
        </Card>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <Card>
          <h2>Distribución por proyecto</h2>
          <div className="bar-chart">
            {byProject.map((item) => (
              <div className="bar-row" key={item.project}>
                <span className="bar-label">{item.project}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(item.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{formatMinutes(item.minutes)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2>Historial reciente</h2>
          <div className="stack-sm">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id}>
                <strong>{entry.activity}</strong>
                <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                  {formatDate(entry.date)} · {entry.project} ·{' '}
                  {formatMinutes(entry.totalMinutes)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Table
        rows={entries}
        rowKey={(row) => row.id}
        columns={[
          {
            key: 'activity',
            header: 'Actividad',
            render: (row) => row.activity,
          },
          {
            key: 'project',
            header: 'Proyecto',
            render: (row) => row.project,
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
            key: 'notes',
            header: 'Observaciones',
            render: (row) => row.notes || '—',
          },
          {
            key: 'actions',
            header: 'Acciones',
            render: (row) => (
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  if (window.confirm('¿Eliminar este registro local?')) {
                    deleteEntry(row.id)
                  }
                }}
              >
                Eliminar
              </Button>
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        title="Registrar tiempo"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="time-form">
              Guardar
            </Button>
          </>
        }
      >
        <form id="time-form" onSubmit={handleSubmit}>
          {error ? (
            <p className="field-error" style={{ marginBottom: '0.75rem' }}>
              {error}
            </p>
          ) : null}
          <Input
            label="Actividad"
            name="activity"
            value={form.activity}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, activity: event.target.value }))
            }
            required
          />
          <Select
            label="Proyecto"
            name="project"
            value={form.project}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, project: event.target.value }))
            }
            options={projects.map((project) => ({
              value: project,
              label: project,
            }))}
          />
          <Input
            label="Fecha"
            name="date"
            type="date"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            required
          />
          <Input
            label="Hora de inicio"
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, startTime: event.target.value }))
            }
            required
          />
          <Input
            label="Hora de finalización"
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, endTime: event.target.value }))
            }
            required
          />
          <Textarea
            label="Observaciones"
            name="notes"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </form>
      </Modal>
    </div>
  )
}
