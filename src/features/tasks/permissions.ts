import type { UserRole } from '../../types/auth'
import type { Task } from '../../types'

export function canManageAllTasks(role: UserRole | undefined): boolean {
  return role === 'ADMIN' || role === 'LEADER'
}

export function canCreateTask(role: UserRole | undefined): boolean {
  return role === 'ADMIN' || role === 'LEADER' || role === 'MEMBER'
}

export function canEditTask(
  role: UserRole | undefined,
  task: Task,
  userName: string | undefined,
): boolean {
  if (!role) return false
  if (canManageAllTasks(role)) return true
  return role === 'MEMBER' && task.assignee === userName
}

export function canDeleteTask(role: UserRole | undefined): boolean {
  return canManageAllTasks(role)
}

export function canAssignTask(role: UserRole | undefined): boolean {
  return canManageAllTasks(role)
}

/** MEMBER solo ve tareas asignadas a su nombre (demo / API). */
export function scopeTasksForRole(
  tasks: Task[],
  role: UserRole | undefined,
  userName: string | undefined,
): Task[] {
  if (!role || canManageAllTasks(role) || !userName) return tasks
  return tasks.filter((task) => task.assignee === userName)
}
