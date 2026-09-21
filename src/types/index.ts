export type TaskStatus =
  | 'pendiente'
  | 'programada'
  | 'en_proceso'
  | 'esperando'
  | 'en_revision'
  | 'terminada'

export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente'

export interface Task {
  id: string
  title: string
  clientOrProject: string
  assignee: string
  priority: TaskPriority
  dueDate: string
  status: TaskStatus
  estimatedHours: number
  description?: string
}

export type AppointmentType =
  | 'reunion'
  | 'soporte'
  | 'entrega'
  | 'demostracion'
  | 'otro'

export interface Appointment {
  id: string
  title: string
  date: string
  time: string
  endTime?: string
  type: AppointmentType
  assignee: string
  description: string
  /** personal = solo el asignado; shared = visible al equipo */
  visibility?: 'personal' | 'shared'
  status?: 'active' | 'cancelled'
}

export interface TimeEntry {
  id: string
  activity: string
  project: string
  date: string
  startTime: string
  endTime: string
  totalMinutes: number
  notes: string
}

export interface ContactFormData {
  name: string
  company: string
  phone: string
  email: string
  service: string
  message: string
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  icon: string
}

export interface SioModule {
  id: string
  name: string
  description: string
  icon: string
}

export interface ActivityItem {
  id: string
  label: string
  time: string
  type: 'task' | 'support' | 'meeting' | 'time'
}

export type { AuthSession, AuthUser, UserRole, LoginPayload } from './auth'
