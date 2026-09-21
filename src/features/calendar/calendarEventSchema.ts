import { z } from 'zod'

export const calendarEventSchema = z
  .object({
    title: z.string().trim().min(3, 'Indique un título'),
    date: z.string().min(1, 'Indique la fecha'),
    time: z.string().min(1, 'Indique la hora de inicio'),
    endTime: z.string().optional(),
    type: z.enum(['reunion', 'soporte', 'entrega', 'demostracion', 'otro']),
    assignee: z.string().trim().min(1, 'Seleccione una persona'),
    description: z.string().optional(),
    visibility: z.enum(['personal', 'shared']),
  })
  .superRefine((values, ctx) => {
    if (!values.endTime) return
    const [sh, sm] = values.time.split(':').map(Number)
    const [eh, em] = values.endTime.split(':').map(Number)
    if (eh * 60 + em <= sh * 60 + sm) {
      ctx.addIssue({
        code: 'custom',
        path: ['endTime'],
        message: 'La hora de fin debe ser posterior al inicio',
      })
    }
  })

export type CalendarEventFormValues = z.output<typeof calendarEventSchema>
export type CalendarEventFormInput = z.input<typeof calendarEventSchema>
