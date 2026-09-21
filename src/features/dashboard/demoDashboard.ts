/**
 * TEMPORAL (DEMO) — agrega indicadores desde LocalStorage / seeds
 * mientras BackCeere no publique /dashboard/*.
 */
import { dashboardBlocks } from '../../data/reports'
import { getAppointments, getTasks, getTimeEntries } from '../../services/dataService'
import { readDemoTimer } from '../time/demoTime'
import type { AuthUser } from '../../types/auth'
import type {
  PersonalDashboard,
  TeamDashboard,
  TimeTrackingStatus,
} from '../../types/dashboard'
import type { TaskStatus } from '../../types'
import { startOfWeekISO, todayISO } from '../../utils'

const TASK_STATUSES: TaskStatus[] = [
  'pendiente',
  'programada',
  'en_proceso',
  'esperando',
  'en_revision',
  'terminada',
]

function isOverdue(dueDate: string, status: TaskStatus, today: string): boolean {
  return status !== 'terminada' && dueDate < today
}

export function buildDemoPersonalDashboard(user: AuthUser): PersonalDashboard {
  const today = todayISO()
  const weekStart = startOfWeekISO()
  const tasks = getTasks()
  const appointments = getAppointments()
  const entries = getTimeEntries()

  const mine = tasks.filter(
    (task) =>
      task.assignee.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) ||
      user.role === 'ADMIN' ||
      user.role === 'LEADER',
  )

  const open = mine.filter((task) => task.status !== 'terminada')
  const overdue = open.filter((task) => isOverdue(task.dueDate, task.status, today))

  const hoursTodayMinutes = entries
    .filter((entry) => entry.date === today)
    .reduce((sum, entry) => sum + entry.totalMinutes, 0)

  const hoursWeekMinutes = entries
    .filter((entry) => entry.date >= weekStart && entry.date <= today)
    .reduce((sum, entry) => sum + entry.totalMinutes, 0)

  const upcomingEvents = appointments
    .filter((item) => item.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      time: item.time,
      type: item.type,
    }))

  // DEMO: refleja el timer activo de sessionStorage si existe.
  const activeTimer = readDemoTimer()
  const timeTrackingStatus: TimeTrackingStatus = activeTimer ? 'running' : 'idle'

  return {
    userName: user.name,
    date: today,
    timeTrackingStatus,
    activeActivityLabel: activeTimer?.description ?? null,
    pendingTasks: open.length,
    overdueTasks: overdue.length,
    hoursTodayMinutes,
    hoursWeekMinutes,
    upcomingEvents,
    dailyReportStatus: 'pending',
    blocks: dashboardBlocks,
    openTasks: open.slice(0, 6).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate,
      assignee: task.assignee,
      clientOrProject: task.clientOrProject,
      overdue: isOverdue(task.dueDate, task.status, today),
    })),
    isDemoData: true,
  }
}

export function buildDemoTeamDashboard(): TeamDashboard {
  const today = todayISO()
  const weekStart = startOfWeekISO()
  const tasks = getTasks()
  const appointments = getAppointments()
  const entries = getTimeEntries()

  const tasksByStatus = TASK_STATUSES.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }))

  const overdueTasks = tasks.filter((task) =>
    isOverdue(task.dueDate, task.status, today),
  ).length

  const byPerson = new Map<string, { name: string; minutes: number }>()
  for (const entry of entries.filter(
    (item) => item.date >= weekStart && item.date <= today,
  )) {
    const key = entry.project || entry.activity
    const current = byPerson.get(key) ?? { name: key, minutes: 0 }
    current.minutes += entry.totalMinutes
    byPerson.set(key, current)
  }

  // DEMO: horas por “proyecto” como proxy de persona hasta existir usuarios API.
  const hoursByPerson = [...byPerson.values()].map((item, index) => ({
    userId: `demo-person-${index}`,
    name: item.name,
    minutes: item.minutes,
    hasActiveTimer: false,
  }))

  const activeTimer = readDemoTimer()

  const upcomingEvents = appointments
    .filter((item) => item.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      time: item.time,
      type: item.type,
    }))

  return {
    date: today,
    tasksByStatus,
    overdueTasks,
    hoursByPerson,
    activeTimers: activeTimer ? 1 : 0,
    dailyReportsSubmitted: 1,
    dailyReportsPending: 2,
    blocks: dashboardBlocks,
    upcomingEvents,
    isDemoData: true,
  }
}
