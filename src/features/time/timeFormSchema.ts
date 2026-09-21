import { z } from 'zod'

const categorySchema = z.enum([
  'desarrollo',
  'soporte',
  'reunion',
  'documentacion',
  'administracion',
  'otro',
])

export const startTimerSchema = z.object({
  taskId: z.string().optional().nullable(),
  category: categorySchema,
  description: z.string().trim().min(3, 'Describa la actividad (mín. 3 caracteres)'),
})

export const manualTimeSchema = z
  .object({
    taskId: z.string().optional().nullable(),
    category: categorySchema,
    description: z.string().trim().min(3, 'Describa la actividad'),
    date: z.string().min(1, 'Indique la fecha'),
    startTime: z.string().min(1, 'Indique hora de inicio'),
    endTime: z.string().min(1, 'Indique hora de fin'),
    notes: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const [sh, sm] = values.startTime.split(':').map(Number)
    const [eh, em] = values.endTime.split(':').map(Number)
    if (eh * 60 + em <= sh * 60 + sm) {
      ctx.addIssue({
        code: 'custom',
        path: ['endTime'],
        message: 'La hora de fin debe ser posterior al inicio',
      })
    }
  })

export type StartTimerValues = z.output<typeof startTimerSchema>
export type StartTimerInput = z.input<typeof startTimerSchema>
export type ManualTimeValues = z.output<typeof manualTimeSchema>
export type ManualTimeInput = z.input<typeof manualTimeSchema>
