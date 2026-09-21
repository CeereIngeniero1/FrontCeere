import { useMemo, useState, type FormEvent } from 'react'
import { AppointmentBadge } from '../../components/ui/StatusBadge'
import { appointmentLabels } from '../../utils/labels'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { assignees } from '../../data/tasks'
import { useAppointments } from '../../hooks/useLocalData'
import type { Appointment, AppointmentType } from '../../types'
import { formatDate, todayISO } from '../../utils'

type AppointmentForm = Omit<Appointment, 'id'>

const emptyForm: AppointmentForm = {
  title: '',
  date: todayISO(),
  time: '09:00',
  type: 'reunion',
  assignee: assignees[0],
  description: '',
}

function toLocalISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<{ date: string; day: number; outside: boolean }> = []

  for (let i = 0; i < startOffset; i += 1) {
    const date = new Date(year, month, -startOffset + i + 1)
    cells.push({
      date: toLocalISO(date),
      day: date.getDate(),
      outside: true,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    cells.push({ date: toLocalISO(date), day, outside: false })
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]
    const [y, m, d] = last.date.split('-').map(Number)
    const date = new Date(y, m - 1, d + 1)
    cells.push({
      date: toLocalISO(date),
      day: date.getDate(),
      outside: true,
    })
  }

  return cells
}

export function AgendaPage() {
  const { appointments, createAppointment, deleteAppointment } = useAppointments()
  const today = todayISO()
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedDate, setSelectedDate] = useState(today)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<AppointmentForm>(emptyForm)

  const cells = useMemo(
    () => buildCalendar(cursor.year, cursor.month),
    [cursor.month, cursor.year],
  )

  const byDate = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    appointments.forEach((item) => {
      const list = map.get(item.date) ?? []
      list.push(item)
      map.set(item.date, list)
    })
    return map
  }, [appointments])

  const selectedItems = (byDate.get(selectedDate) ?? []).sort((a, b) =>
    a.time.localeCompare(b.time),
  )

  const todayItems = (byDate.get(today) ?? []).sort((a, b) =>
    a.time.localeCompare(b.time),
  )

  const upcoming = appointments
    .filter((item) => item.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 6)

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    'es-CO',
    { month: 'long', year: 'numeric' },
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date || !form.time) return
    createAppointment(form)
    setSelectedDate(form.date)
    setModalOpen(false)
    setForm({ ...emptyForm, date: form.date })
  }

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Calendario mensual y listado de actividades locales de demostración."
        actions={
          <Button
            onClick={() => {
              setForm({ ...emptyForm, date: selectedDate })
              setModalOpen(true)
            }}
          >
            Nueva actividad
          </Button>
        }
      />

      <div className="calendar-grid">
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{monthLabel}</h2>
            <div className="inline-actions">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCursor((prev) => {
                    const date = new Date(prev.year, prev.month - 1, 1)
                    return { year: date.getFullYear(), month: date.getMonth() }
                  })
                }
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCursor((prev) => {
                    const date = new Date(prev.year, prev.month + 1, 1)
                    return { year: date.getFullYear(), month: date.getMonth() }
                  })
                }
              >
                Siguiente
              </Button>
            </div>
          </div>

          <div className="calendar" role="grid" aria-label="Calendario mensual">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
            {cells.map((cell) => {
              const hasItems = (byDate.get(cell.date) ?? []).length > 0
              return (
                <button
                  key={`${cell.date}-${cell.outside}`}
                  type="button"
                  className={`calendar-day ${cell.outside ? 'is-outside' : ''} ${
                    selectedDate === cell.date ? 'is-selected' : ''
                  }`}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  <div className="calendar-day-number">{cell.day}</div>
                  {hasItems ? <div className="calendar-dot" aria-hidden /> : null}
                </button>
              )
            })}
          </div>
        </Card>

        <div className="stack-sm">
          <Card>
            <h2>Actividades del {formatDate(selectedDate)}</h2>
            {selectedItems.length === 0 ? (
              <p className="empty-state">No hay actividades para esta fecha.</p>
            ) : (
              <div className="stack-sm">
                {selectedItems.map((item) => (
                  <div key={item.id}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong>
                        {item.time} · {item.title}
                      </strong>
                      <AppointmentBadge type={item.type} />
                    </div>
                    <div style={{ color: 'var(--color-gray-500)' }}>
                      {item.assignee} — {item.description}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (window.confirm('¿Eliminar esta actividad local?')) {
                          deleteAppointment(item.id)
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2>Hoy</h2>
            {todayItems.length === 0 ? (
              <p className="empty-state">Sin actividades para hoy.</p>
            ) : (
              <ul>
                {todayItems.map((item) => (
                  <li key={item.id}>
                    {item.time} — {item.title} ({appointmentLabels[item.type]})
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2>Próximas</h2>
            <ul>
              {upcoming.map((item) => (
                <li key={item.id}>
                  {formatDate(item.date)} {item.time} — {item.title}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Nueva actividad"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="appointment-form">
              Guardar
            </Button>
          </>
        }
      >
        <form id="appointment-form" onSubmit={handleSubmit}>
          <Input
            label="Título"
            name="title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
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
            label="Hora"
            name="time"
            type="time"
            value={form.time}
            onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            required
          />
          <Select
            label="Tipo"
            name="type"
            value={form.type}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                type: event.target.value as AppointmentType,
              }))
            }
            options={Object.entries(appointmentLabels).map(([value, label]) => ({
              value,
              label,
            }))}
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
