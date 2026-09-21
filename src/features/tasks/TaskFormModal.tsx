import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { priorityLabels, statusLabels } from '../../utils/labels'
import { DEMO_ASSIGNEES } from './demoTasks'
import { taskFormSchema, type TaskFormInput, type TaskFormValues } from './taskFormSchema'

interface TaskFormModalProps {
  open: boolean
  title: string
  initialValues: TaskFormValues
  assigneeOptions: string[]
  canAssign: boolean
  submitting?: boolean
  errorMessage?: string
  onClose: () => void
  onSubmit: (values: TaskFormValues) => Promise<void> | void
}

export function TaskFormModal({
  open,
  title,
  initialValues,
  assigneeOptions,
  canAssign,
  submitting = false,
  errorMessage,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  const assignees =
    assigneeOptions.length > 0 ? assigneeOptions : [...DEMO_ASSIGNEES]

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
          <Button type="submit" form="task-form" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </>
      }
    >
      <form
        id="task-form"
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
          label="Cliente o proyecto"
          {...register('clientOrProject')}
          error={errors.clientOrProject?.message}
          required
        />
        <Select
          label="Responsable"
          {...register('assignee')}
          disabled={!canAssign}
          error={errors.assignee?.message}
          options={assignees.map((name) => ({ value: name, label: name }))}
        />
        <Select
          label="Prioridad"
          {...register('priority')}
          error={errors.priority?.message}
          options={Object.entries(priorityLabels).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Select
          label="Estado"
          {...register('status')}
          error={errors.status?.message}
          options={Object.entries(statusLabels).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Input
          label="Fecha límite"
          type="date"
          {...register('dueDate')}
          error={errors.dueDate?.message}
          required
        />
        <Input
          label="Tiempo estimado (horas)"
          type="number"
          min={0.5}
          step={0.5}
          {...register('estimatedHours')}
          error={errors.estimatedHours?.message}
          required
        />
        <Textarea label="Descripción" {...register('description')} />
      </form>
    </Modal>
  )
}
