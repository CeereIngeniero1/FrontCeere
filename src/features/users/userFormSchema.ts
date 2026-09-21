import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().trim().min(3, 'Indique el nombre'),
  email: z.string().trim().email('Correo no válido'),
  role: z.enum(['ADMIN', 'LEADER', 'MEMBER']),
  temporaryPassword: z
    .string()
    .min(6, 'La contraseña temporal debe tener al menos 6 caracteres'),
})

export const updateUserSchema = z.object({
  name: z.string().trim().min(3, 'Indique el nombre'),
  email: z.string().trim().email('Correo no válido'),
  role: z.enum(['ADMIN', 'LEADER', 'MEMBER']),
  isActive: z.boolean(),
})

export type CreateUserFormValues = z.output<typeof createUserSchema>
export type CreateUserFormInput = z.input<typeof createUserSchema>
export type UpdateUserFormValues = z.output<typeof updateUserSchema>
export type UpdateUserFormInput = z.input<typeof updateUserSchema>
