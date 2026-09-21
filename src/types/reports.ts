export interface ReportsQuery {
  from: string
  to: string
}

export interface ReportsSummary {
  from: string
  to: string
  hoursByUser: Array<{ userId: string; name: string; minutes: number }>
  hoursByCategory: Array<{ category: string; minutes: number }>
  tasksCompleted: number
  tasksOverdue: number
  dailyReportsSubmitted: number
  dailyReportsExpected: number
  blocks: Array<{ id: string; title: string; detail: string }>
  isDemoData: boolean
}
