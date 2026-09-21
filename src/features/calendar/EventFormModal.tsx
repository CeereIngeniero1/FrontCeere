import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { appointmentLabels } from '../../utils/labels'
import { eventVisibilityLabels } from '../../types/calendar'
import { DEMO_CALENDAR_ASSIGNEES } from './demoCalendar'
import {
  calendarEventSchema,
  type CalendarEventFormInput,
  type CalendarEventFormValues,
} from './calendarEventSchema'

interface EventFormModalProps {
  open: boolean
  title: string
  initialValues: CalendarEventFormValues
  assigneeOptions?: string[]
  submitting?: boolean
  errorMessage?: string
  onClose: () => void
  onSubmit: (values: CalendarEventFormValues) => Promise<void> | void
}

export function EventFormModal({
  open,
  title,
  initialValues,
  assigneeOptions = [...DEMO_CALENDAR_ASSIGNEES],
  submitting = false,
  errorMessage,
  onClose,
  onSubmit,
}: EventFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalendarEventFormInput, unknown, CalendarEventFormValues>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="calendar-event-form" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </>
      }
    >
      <form
        id="calendar-event-form"
        onSubmit={(event) => {
          void handleSubmit(async (values) => {
            await onSubmit(values)
          })(event)
        }}
        noValidate
      >
        {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
        <Input
          label="Título"
          {...register('title')}
          error={errors.title?.message}
          required
        />
        <Input
          label="Fecha"
          type="date"
          {...register('date')}
          error={errors.date?.message}
          required
        />
        <Input
          label="Hora de inicio"
          type="time"
          {...register('time')}
          error={errors.time?.message}
          required
        />
        <Input
          label="Hora de fin (opcional)"
          type="time"
          {...register('endTime')}
          error={errors.endTime?.message}
        />
        <Select
          label="Tipo"
          {...register('type')}
          error={errors.type?.message}
          options={Object.entries(appointmentLabels).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Select
          label="Persona"
          {...register('assignee')}
          error={errors.assignee?.message}
          options={assigneeOptions.map((name) => ({ value: name, label: name }))}
        />
        <Select
          label="Visibilidad"
          {...register('visibility')}
          error={errors.visibility?.message}
          options={Object.entries(eventVisibilityLabels).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Textarea label="Descripción" {...register('description')} />
      </form>
    </Modal>
  )
}
