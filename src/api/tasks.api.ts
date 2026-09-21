import { apiDelete, apiGet, apiPatch, apiPost } from './http-client'
import { isDemoAuthMode } from '../features/auth/demoAuth'
import {
  createDemoTask,
  deleteDemoTask,
  listDemoTasks,
  updateDemoTask,
} from '../features/tasks/demoTasks'
import type { Task } from '../types'
import type { TaskFilters, TaskListResult, TaskWritePayload } from '../types/tasks'

function toQuery(filters: TaskFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.assignee) params.set('assignee', filters.assignee)
  if (filters.priority) params.set('priority', filters.priority)
  if (filters.status) params.set('status', filters.status)
  if (filters.overdueOnly) params.set('overdueOnly', 'true')
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** GET /tasks */
export async function listTasks(
  filters: TaskFilters = {},
  signal?: AbortSignal,
): Promise<TaskListResult> {
  if (isDemoAuthMode()) {
    return { items: listDemoTasks(filters), isDemoData: true }
  }

  const data = await apiGet<Task[] | { items: Task[] }>(`/tasks${toQuery(filters)}`, {
    signal,
  })
  const items = Array.isArray(data) ? data : data.items
  return { items, isDemoData: false }
}

/** POST /tasks */
export async function createTask(payload: TaskWritePayload): Promise<Task> {
  if (isDemoAuthMode()) {
    return createDemoTask(payload)
  }
  return apiPost<Task>('/tasks', payload)
}

/** PATCH /tasks/:id */
export async function updateTask(
  id: string,
  payload: Partial<TaskWritePayload>,
): Promise<Task> {
  if (isDemoAuthMode()) {
    return updateDemoTask(id, payload)
  }
  return apiPatch<Task>(`/tasks/${id}`, payload)
}

/** DELETE /tasks/:id */
export async function deleteTask(id: string): Promise<void> {
  if (isDemoAuthMode()) {
    deleteDemoTask(id)
    return
  }
  await apiDelete<void>(`/tasks/${id}`)
}
