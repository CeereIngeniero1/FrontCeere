import type { Task, TaskPriority, TaskStatus } from './index'

export interface TaskFilters {
  search?: string
  assignee?: string
  priority?: TaskPriority | ''
  status?: TaskStatus | ''
  overdueOnly?: boolean
}

export interface TaskWritePayload {
  title: string
  clientOrProject: string
  assignee: string
  priority: TaskPriority
  dueDate: string
  status: TaskStatus
  estimatedHours: number
  description?: string
}

export type TaskListResult = {
  items: Task[]
  isDemoData: boolean
}
