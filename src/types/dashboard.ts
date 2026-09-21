import type { TaskStatus } from './index'

/** Contratos esperados de GET /dashboard/me y GET /dashboard/team (BackCeere). */

export type TimeTrackingStatus = 'idle' | 'running' | 'paused'
export type DailyReportStatus = 'pending' | 'submitted' | 'not_required'

export interface DashboardEventSummary {
  id: string
  title: string
  date: string
  time: string
  type?: string
}

export interface DashboardBlockSummary {
  id: string
  title: string
  detail: string
}

export interface DashboardTaskSummary {
  id: string
  title: string
  status: TaskStatus
  dueDate: string
  assignee?: string
  clientOrProject?: string
  overdue: boolean
}

export interface PersonalDashboard {
  userName: string
  date: string
  timeTrackingStatus: TimeTrackingStatus
  activeActivityLabel?: string | null
  pendingTasks: number
  overdueTasks: number
  hoursTodayMinutes: number
  hoursWeekMinutes: number
  upcomingEvents: DashboardEventSummary[]
  dailyReportStatus: DailyReportStatus
  blocks: DashboardBlockSummary[]
  openTasks: DashboardTaskSummary[]
  /** true cuando los datos vienen del agregador DEMO local */
  isDemoData: boolean
}

export interface TeamMemberHours {
  userId: string
  name: string
  minutes: number
  hasActiveTimer: boolean
}

export interface TeamDashboard {
  date: string
  tasksByStatus: Array<{ status: TaskStatus; count: number }>
  overdueTasks: number
  hoursByPerson: TeamMemberHours[]
  activeTimers: number
  dailyReportsSubmitted: number
  dailyReportsPending: number
  blocks: DashboardBlockSummary[]
  upcomingEvents: DashboardEventSummary[]
  isDemoData: boolean
}
