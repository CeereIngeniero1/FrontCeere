import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().trim().min(3, 'Indique un título de al menos 3 caracteres'),
  clientOrProject: z.string().trim().min(2, 'Indique cliente o proyecto'),
  assignee: z.string().trim().min(1, 'Seleccione un responsable'),
  priority: z.enum(['baja', 'media', 'alta', 'urgente']),
  dueDate: z.string().min(1, 'Indique la fecha límite'),
  status: z.enum([
    'pendiente',
    'programada',
    'en_proceso',
    'esperando',
    'en_revision',
    'terminada',
  ]),
  estimatedHours: z.coerce
    .number()
    .min(0.5, 'Mínimo 0.5 h')
    .max(200, 'Máximo 200 h'),
  description: z.string().optional(),
})

export type TaskFormValues = z.output<typeof taskFormSchema>
export type TaskFormInput = z.input<typeof taskFormSchema>
