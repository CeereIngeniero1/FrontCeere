import { z } from 'zod'

export const dailyReportSchema = z.object({
  completed: z
    .string()
    .trim()
    .min(5, 'Indique qué completó hoy (mín. 5 caracteres)'),
  pending: z
    .string()
    .trim()
    .min(3, 'Indique qué quedó pendiente'),
  blockers: z
    .string()
    .trim()
    .min(2, 'Indique si hay bloqueos o escriba “Ninguno”'),
  notes: z.string().optional(),
})

export type DailyReportFormValues = z.output<typeof dailyReportSchema>
export type DailyReportFormInput = z.input<typeof dailyReportSchema>
