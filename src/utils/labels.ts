import type { AppointmentType, TaskPriority, TaskStatus } from '../types'

export const statusLabels: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  programada: 'Programada',
  en_proceso: 'En proceso',
  esperando: 'Esperando',
  en_revision: 'En revisión',
  terminada: 'Terminada',
}

export const priorityLabels: Record<TaskPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const appointmentLabels: Record<AppointmentType, string> = {
  reunion: 'Reunión',
  soporte: 'Soporte',
  entrega: 'Entrega',
  demostracion: 'Demostración',
  otro: 'Otro',
}
