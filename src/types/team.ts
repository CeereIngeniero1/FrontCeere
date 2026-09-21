import type { UserRole } from './auth'

export interface TeamMemberSummary {
  userId: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  pendingTasks: number
  periodMinutes: number
  dailyReportStatus: 'pending' | 'submitted' | 'not_required'
}

export interface TeamMembersResult {
  periodFrom: string
  periodTo: string
  members: TeamMemberSummary[]
  isDemoData: boolean
}
