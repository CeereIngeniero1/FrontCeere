/**
 * TEMPORAL (DEMO) — resumen de equipo a partir de usuarios + tareas + tiempo + reportes.
 */
import { listDemoUsers } from '../users/demoUsers'
import { getTasks, getTimeEntries } from '../../services/dataService'
import { listDemoTeamReports } from '../daily-reports/demoDailyReports'
import type { TeamMemberSummary, TeamMembersResult } from '../../types/team'
import { todayISO } from '../../utils'

export function buildDemoTeamMembers(
  periodFrom: string,
  periodTo: string,
): TeamMembersResult {
  const users = listDemoUsers()
  const tasks = getTasks()
  const entries = getTimeEntries()
  const reports = listDemoTeamReports().items
  const today = todayISO()

  const members: TeamMemberSummary[] = users.map((user) => {
    const pendingTasks = tasks.filter(
      (task) => task.assignee === user.name && task.status !== 'terminada',
    ).length

    const activeCount = Math.max(users.filter((item) => item.isActive).length, 1)
    const totalPeriod = entries
      .filter((entry) => entry.date >= periodFrom && entry.date <= periodTo)
      .reduce((sum, entry) => sum + entry.totalMinutes, 0)
    const periodMinutes = user.isActive
      ? Math.round(totalPeriod / activeCount)
      : 0

    const todayReport = reports.find(
      (report) => report.userId === user.id && report.date === today,
    )

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      pendingTasks,
      periodMinutes,
      dailyReportStatus: !user.isActive
        ? 'not_required'
        : todayReport
          ? 'submitted'
          : 'pending',
    }
  })

  return {
    periodFrom,
    periodTo,
    members,
    isDemoData: true,
  }
}
