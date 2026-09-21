import { useMemo, useState } from 'react'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionCard,
} from '../../components/feedback/QueryState'
import { AppointmentBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { useAuth } from '../../hooks/useAuth'
import {
  useCalendarEventsQuery,
  useCalendarMutations,
} from '../../hooks/useCalendarQuery'
import { ApiError } from '../../types/api'
import type { AppointmentType } from '../../types'
import type {
  CalendarEvent,
  CalendarFilters,
  CalendarViewMode,
  EventVisibility,
} from '../../types/calendar'
import { eventVisibilityLabels } from '../../types/calendar'
import { todayISO } from '../../utils'
import { appointmentLabels } from '../../utils/labels'
import {
  calendarEventSchema,
  type CalendarEventFormValues,
} from './calendarEventSchema'
import {
  buildMonthCells,
  buildWeekDays,
  dayLabel,
  isToday,
  monthLabel,
  parseISODate,
  shiftCursor,
  shortDayLabel,
  toISODate,
  weekLabel,
} from './calendarUtils'
import { DEMO_CALENDAR_ASSIGNEES } from './demoCalendar'
import { EventFormModal } from './EventFormModal'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function defaultForm(date: string, assignee: string): CalendarEventFormValues {
  return {
    title: '',
    date,
    time: '09:00',
    endTime: '10:00',
    type: 'reunion',
    assignee,
    description: '',
    visibility: 'shared',
  }
}

export function AgendaView() {
  const { user } = useAuth()
  const [view, setView] = useState<CalendarViewMode>('month')
  const [cursor, setCursor] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [filters, setFilters] = useState<CalendarFilters>({
    assignee: '',
    type: '',
    visibility: '',
    includeCancelled: false,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)
  const [formError, setFormError] = useState('')

  const query = useCalendarEventsQuery(filters)
  const { createMutation, updateMutation, cancelMutation, deleteMutation } =
    useCalendarMutations()

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    const items = query.data?.items ?? []
    for (const event of items) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time))
    }
    return map
  }, [query.data?.items])

  const selectedEvents = byDate.get(selectedDate) ?? []
  const monthCells = useMemo(() => buildMonthCells(cursor), [cursor])
  const weekDays = useMemo(() => buildWeekDays(cursor), [cursor])

  const rangeTitle =
    view === 'month'
      ? monthLabel(cursor)
      : view === 'week'
        ? weekLabel(weekDays[0], weekDays[6])
        : dayLabel(parseISODate(selectedDate))

  const openCreate = (date = selectedDate) => {
    setEditing(null)
    setFormError('')
    setSelectedDate(date)
    setModalOpen(true)
  }

  const openEdit = (event: CalendarEvent) => {
    setEditing(event)
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (values: CalendarEventFormValues) => {
    setFormError('')
    try {
      calendarEventSchema.parse(values)
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          payload: {
            ...values,
            endTime: values.endTime || undefined,
          },
        })
      } else {
        await createMutation.mutateAsync({
          ...values,
          endTime: values.endTime || undefined,
        })
      }
      setSelectedDate(values.date)
      setCursor(parseISODate(values.date))
      setModalOpen(false)
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'No se pudo guardar el evento.',
      )
    }
  }

  const handleCancel = async (event: CalendarEvent) => {
    if (!window.confirm(`¿Cancelar el evento "${event.title}"?`)) return
    await cancelMutation.mutateAsync(event.id)
  }

  const handleDelete = async (event: CalendarEvent) => {
    if (!window.confirm(`¿Eliminar permanentemente "${event.title}"?`)) return
    await deleteMutation.mutateAsync(event.id)
  }

  if (query.isLoading) return <LoadingState label="Cargando agenda…" />
  if (query.isError) {
    const message =
      query.error instanceof ApiError
        ? query.error.message
        : 'No se pudo cargar la agenda.'
    return <ErrorState message={message} onRetry={() => void query.refetch()} />
  }

  const formValues: CalendarEventFormValues = editing
    ? {
        title: editing.title,
        date: editing.date,
        time: editing.time,
        endTime: editing.endTime ?? '',
        type: editing.type,
        assignee: editing.assignee,
        description: editing.description,
        visibility: editing.visibility,
      }
    : defaultForm(selectedDate, user?.name ?? DEMO_CALENDAR_ASSIGNEES[0])

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Vistas mensual, semanal y diaria. Eventos personales y compartidos con colores por tipo."
        actions={
          <Button type="button" onClick={() => openCreate()}>
            Nuevo evento
          </Button>
        }
      />

      {query.data?.isDemoData ? (
        <p className="demo-inline" role="note">
          Datos DEMO temporales. API prevista: <code>/calendar/events</code>.
        </p>
      ) : null}

      <Card style={{ marginBottom: '1rem' }}>
        <div className="filters-bar">
          <div className="tabs-bar" role="tablist" aria-label="Vista de calendario">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                className={view === mode ? 'tab active' : 'tab'}
                aria-selected={view === mode}
                onClick={() => {
                  setView(mode)
                  if (mode === 'day') setCursor(parseISODate(selectedDate))
                }}
              >
                {mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Día'}
              </button>
            ))}
          </div>
          <Select
            label="Persona"
            name="filter-assignee"
            value={filters.assignee ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, assignee: event.target.value }))
            }
            options={[
              { value: '', label: 'Todas' },
              ...DEMO_CALENDAR_ASSIGNEES.map((name) => ({
                value: name,
                label: name,
              })),
            ]}
          />
          <Select
            label="Tipo"
            name="filter-type"
            value={filters.type ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                type: event.target.value as AppointmentType | '',
              }))
            }
            options={[
              { value: '', label: 'Todos' },
              ...Object.entries(appointmentLabels).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <Select
            label="Visibilidad"
            name="filter-visibility"
            value={filters.visibility ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                visibility: event.target.value as EventVisibility | '',
              }))
            }
            options={[
              { value: '', label: 'Todas' },
              ...Object.entries(eventVisibilityLabels).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <label className="filter-check">
            <input
              type="checkbox"
              checked={Boolean(filters.includeCancelled)}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  includeCancelled: event.target.checked,
                }))
              }
            />
            Incluir cancelados
          </label>
        </div>
      </Card>

      <div className="calendar-grid">
        <Card>
          <div className="calendar-toolbar">
            <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{rangeTitle}</h2>
            <div className="inline-actions">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setCursor((prev) => shiftCursor(prev, view, -1))}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => {
                  const now = new Date()
                  setCursor(now)
                  setSelectedDate(toISODate(now))
                }}
              >
                Hoy
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setCursor((prev) => shiftCursor(prev, view, 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>

          {view === 'month' ? (
            <div className="calendar" role="grid" aria-label="Calendario mensual">
              {WEEKDAYS.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
              {monthCells.map((cell) => {
                const dayEvents = byDate.get(cell.date) ?? []
                return (
                  <button
                    key={cell.date}
                    type="button"
                    className={`calendar-day ${cell.outside ? 'is-outside' : ''} ${
                      selectedDate === cell.date ? 'is-selected' : ''
                    } ${isToday(cell.date) ? 'is-today' : ''}`}
                    onClick={() => {
                      setSelectedDate(cell.date)
                      setCursor(cell.dateObj)
                    }}
                    onDoubleClick={() => openCreate(cell.date)}
                  >
                    <div className="calendar-day-number">{cell.day}</div>
                    <div className="calendar-day-events">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className={`cal-chip cal-chip--${event.type} ${
                            event.status === 'cancelled' ? 'is-cancelled' : ''
                          }`}
                          title={`${event.time} ${event.title}`}
                        >
                          {event.time} {event.title}
                        </span>
                      ))}
                      {dayEvents.length > 3 ? (
                        <span className="cal-more">+{dayEvents.length - 3}</span>
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : null}

          {view === 'week' ? (
            <div className="week-grid" role="list" aria-label="Vista semanal">
              {weekDays.map((day) => {
                const iso = toISODate(day)
                const dayEvents = byDate.get(iso) ?? []
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`week-day ${selectedDate === iso ? 'is-selected' : ''} ${
                      isToday(day) ? 'is-today' : ''
                    }`}
                    onClick={() => {
                      setSelectedDate(iso)
                      setCursor(day)
                    }}
                  >
                    <strong>{shortDayLabel(day)}</strong>
                    <span className="week-day-date">{toISODate(day)}</span>
                    {dayEvents.length === 0 ? (
                      <em className="cal-empty">Sin eventos</em>
                    ) : (
                      dayEvents.map((event) => (
                        <span
                          key={event.id}
                          className={`cal-chip cal-chip--${event.type} ${
                            event.status === 'cancelled' ? 'is-cancelled' : ''
                          }`}
                        >
                          {event.time} · {event.title}
                        </span>
                      ))
                    )}
                  </button>
                )
              })}
            </div>
          ) : null}

          {view === 'day' ? (
            <div className="day-view">
              <p className="day-view-heading">{dayLabel(parseISODate(selectedDate))}</p>
              {(byDate.get(selectedDate) ?? []).length === 0 ? (
                <EmptyState
                  title="Sin eventos este día"
                  description="Cree un evento o elija otra fecha."
                />
              ) : (
                <ul className="dash-list">
                  {(byDate.get(selectedDate) ?? []).map((event) => (
                    <li key={event.id}>
                      <strong>
                        {event.time}
                        {event.endTime ? ` – ${event.endTime}` : ''} · {event.title}
                      </strong>
                      <span>
                        {appointmentLabels[event.type]} · {event.assignee} ·{' '}
                        {eventVisibilityLabels[event.visibility]}
                        {event.status === 'cancelled' ? ' · Cancelado' : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </Card>

        <SectionCard title={`Eventos del ${selectedDate}`}>
          {selectedEvents.length === 0 ? (
            <EmptyState title="No hay eventos para esta fecha" />
          ) : (
            <div className="stack-sm">
              {selectedEvents.map((event) => (
                <article
                  key={event.id}
                  className={`agenda-event agenda-event--${event.type} ${
                    event.status === 'cancelled' ? 'is-cancelled' : ''
                  }`}
                >
                  <div className="agenda-event-head">
                    <strong>
                      {event.time}
                      {event.endTime ? ` – ${event.endTime}` : ''} · {event.title}
                    </strong>
                    <AppointmentBadge type={event.type} />
                  </div>
                  <p>
                    {event.assignee} · {eventVisibilityLabels[event.visibility]}
                    {event.status === 'cancelled' ? ' · Cancelado' : ''}
                  </p>
                  {event.description ? <p>{event.description}</p> : null}
                  <div className="inline-actions">
                    {event.status !== 'cancelled' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() => openEdit(event)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() => void handleCancel(event)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : null}
                    <Button
                      size="sm"
                      variant="danger"
                      type="button"
                      onClick={() => void handleDelete(event)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <EventFormModal
        open={modalOpen}
        title={editing ? 'Editar evento' : 'Nuevo evento'}
        initialValues={formValues}
        submitting={createMutation.isPending || updateMutation.isPending}
        errorMessage={formError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  )
}
