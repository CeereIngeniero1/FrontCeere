/**
 * TEMPORAL (DEMO) — persistencia LocalStorage de tareas
 * hasta que BackCeere publique /tasks.
 */
import { assignees as seedAssignees, initialTasks } from '../../data/tasks'
import { getTasks, saveTasks } from '../../services/dataService'
import type { Task } from '../../types'
import type { TaskFilters, TaskWritePayload } from '../../types/tasks'
import { createId, todayISO } from '../../utils'

export const DEMO_ASSIGNEES = [
  ...seedAssignees,
  'Administrador Demo',
  'Líder Demo',
  'Miembro Demo',
] as const

function isOverdue(task: Task, today = todayISO()): boolean {
  return task.status !== 'terminada' && Boolean(task.dueDate) && task.dueDate < today
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.search?.trim().toLowerCase() ?? ''
  const today = todayISO()

  return tasks.filter((task) => {
    if (filters.assignee && task.assignee !== filters.assignee) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.status && task.status !== filters.status) return false
    if (filters.overdueOnly && !isOverdue(task, today)) return false
    if (search) {
      const haystack = [
        task.title,
        task.clientOrProject,
        task.assignee,
        task.description ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })
}

export function listDemoTasks(filters: TaskFilters = {}): Task[] {
  const stored = getTasks()
  const source = stored.length > 0 ? stored : initialTasks
  if (stored.length === 0) saveTasks(initialTasks)
  return filterTasks(source, filters)
}

export function createDemoTask(payload: TaskWritePayload): Task {
  const task: Task = { id: createId('task'), ...payload }
  saveTasks([task, ...getTasks()])
  return task
}

export function updateDemoTask(id: string, payload: Partial<TaskWritePayload>): Task {
  const tasks = getTasks()
  const index = tasks.findIndex((task) => task.id === id)
  if (index < 0) {
    throw new Error('Tarea no encontrada')
  }
  const next = { ...tasks[index], ...payload }
  const copy = [...tasks]
  copy[index] = next
  saveTasks(copy)
  return next
}

export function deleteDemoTask(id: string): void {
  saveTasks(getTasks().filter((task) => task.id !== id))
}

export { isOverdue as isTaskOverdue }
