/**
 * TEMPORAL (DEMO) — reportes agregados por rango de fechas.
 */
import { dashboardBlocks } from '../../data/reports'
import { getTasks, getTimeEntries } from '../../services/dataService'
import { listDemoTeamReports } from '../daily-reports/demoDailyReports'
import { listDemoUsers } from '../users/demoUsers'
import type { ReportsQuery, ReportsSummary } from '../../types/reports'
import { todayISO } from '../../utils'
import { timeCategoryLabels } from '../../types/time'

export function buildDemoReportsSummary(query: ReportsQuery): ReportsSummary {
  const { from, to } = query
  const today = todayISO()
  const users = listDemoUsers().filter((user) => user.isActive)
  const tasks = getTasks().filter(
    (task) => task.dueDate >= from && task.dueDate <= to,
  )
  const entries = getTimeEntries().filter(
    (entry) => entry.date >= from && entry.date <= to,
  )
  const reports = listDemoTeamReports().items.filter(
    (report) => report.date >= from && report.date <= to,
  )

  const totalMinutes = entries.reduce((sum, entry) => sum + entry.totalMinutes, 0)
  const hoursByUser = users.map((user) => ({
    userId: user.id,
    name: user.name,
    minutes: Math.round(totalMinutes / Math.max(users.length, 1)),
  }))

  const byCategory = new Map<string, number>()
  for (const entry of entries) {
    const key =
      'category' in entry && entry.category
        ? String(entry.category)
        : entry.project || 'otro'
    byCategory.set(key, (byCategory.get(key) ?? 0) + entry.totalMinutes)
  }

  const hoursByCategory = [...byCategory.entries()]
    .map(([category, minutes]) => ({
      category:
        timeCategoryLabels[category as keyof typeof timeCategoryLabels] ?? category,
      minutes,
    }))
    .sort((a, b) => b.minutes - a.minutes)

  const blocksFromReports = reports
    .filter((report) => {
      const text = report.blockers.trim().toLowerCase()
      return text && text !== 'ninguno' && text !== 'ningún' && text !== 'no'
    })
    .map((report) => ({
      id: report.id,
      title: `Bloqueo · ${report.userName}`,
      detail: report.blockers,
    }))

  return {
    from,
    to,
    hoursByUser,
    hoursByCategory,
    tasksCompleted: tasks.filter((task) => task.status === 'terminada').length,
    tasksOverdue: tasks.filter(
      (task) => task.status !== 'terminada' && task.dueDate < today,
    ).length,
    dailyReportsSubmitted: reports.length,
    dailyReportsExpected: users.length * Math.max(1, daysBetween(from, to)),
    blocks: blocksFromReports.length > 0 ? blocksFromReports : dashboardBlocks,
    isDemoData: true,
  }
}

function daysBetween(from: string, to: string): number {
  const start = new Date(from)
  const end = new Date(to)
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000)
  return Math.max(1, diff + 1)
}
