export interface DailyReport {
  id: string
  userId: string
  userName: string
  date: string
  completed: string
  pending: string
  blockers: string
  notes: string
  submittedAt: string
  updatedAt: string
}

export interface DailyReportPayload {
  completed: string
  pending: string
  blockers: string
  notes?: string
}

export interface DailyReportTodayResult {
  report: DailyReport | null
  status: 'pending' | 'submitted'
  date: string
  isDemoData: boolean
}

export interface DailyReportListResult {
  items: DailyReport[]
  isDemoData: boolean
}
