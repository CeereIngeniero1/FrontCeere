/**
 * TEMPORAL (DEMO) — reportes diarios en LocalStorage.
 */
import { readStorage, writeStorage } from '../../services/storage'
import type { AuthUser } from '../../types/auth'
import type {
  DailyReport,
  DailyReportListResult,
  DailyReportPayload,
  DailyReportTodayResult,
} from '../../types/daily-reports'
import { createId, todayISO } from '../../utils'

function allReports(): DailyReport[] {
  return readStorage<DailyReport[]>('dailyReports', [])
}

function saveAll(reports: DailyReport[]): void {
  writeStorage('dailyReports', reports)
}

export function getDemoTodayReport(user: AuthUser): DailyReportTodayResult {
  const date = todayISO()
  const report =
    allReports().find((item) => item.userId === user.id && item.date === date) ??
    null
  return {
    report,
    status: report ? 'submitted' : 'pending',
    date,
    isDemoData: true,
  }
}

export function listDemoMyReports(user: AuthUser): DailyReportListResult {
  const items = allReports()
    .filter((item) => item.userId === user.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  return { items, isDemoData: true }
}

export function listDemoTeamReports(): DailyReportListResult {
  const items = [...allReports()].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date)
    if (byDate !== 0) return byDate
    return a.userName.localeCompare(b.userName)
  })
  return { items, isDemoData: true }
}

export function upsertDemoDailyReport(
  user: AuthUser,
  payload: DailyReportPayload,
): DailyReport {
  const date = todayISO()
  const now = new Date().toISOString()
  const reports = allReports()
  const existingIndex = reports.findIndex(
    (item) => item.userId === user.id && item.date === date,
  )

  if (existingIndex >= 0) {
    const updated: DailyReport = {
      ...reports[existingIndex],
      completed: payload.completed.trim(),
      pending: payload.pending.trim(),
      blockers: payload.blockers.trim(),
      notes: payload.notes?.trim() ?? '',
      updatedAt: now,
    }
    const next = [...reports]
    next[existingIndex] = updated
    saveAll(next)
    return updated
  }

  const created: DailyReport = {
    id: createId('dreport'),
    userId: user.id,
    userName: user.name,
    date,
    completed: payload.completed.trim(),
    pending: payload.pending.trim(),
    blockers: payload.blockers.trim(),
    notes: payload.notes?.trim() ?? '',
    submittedAt: now,
    updatedAt: now,
  }
  saveAll([created, ...reports])
  return created
}

/** Seed mínimo para vista de equipo en demo. */
export function ensureDemoTeamSeeds(currentUser: AuthUser): void {
  const reports = allReports()
  if (reports.length > 0) return

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const y = yesterday.toISOString().slice(0, 10)

  const seeds: DailyReport[] = [
    {
      id: 'dreport-seed-1',
      userId: 'demo-leader',
      userName: 'Líder Demo',
      date: y,
      completed: 'Revisión de avances del equipo y seguimiento de tickets críticos.',
      pending: 'Priorizar demostración con prospecto.',
      blockers: 'Esperando acceso al ambiente de pruebas del cliente.',
      notes: '',
      submittedAt: `${y}T18:00:00.000Z`,
      updatedAt: `${y}T18:00:00.000Z`,
    },
    {
      id: 'dreport-seed-2',
      userId: 'demo-member',
      userName: 'Miembro Demo',
      date: y,
      completed: 'Checklist de soporte y actualización de documentación breve.',
      pending: 'Cerrar tarea de checklist diario.',
      blockers: 'Ninguno',
      notes: 'Jornada estable.',
      submittedAt: `${y}T17:30:00.000Z`,
      updatedAt: `${y}T17:30:00.000Z`,
    },
  ]

  // No incluir seed del usuario actual para que el estado “pendiente” sea visible al entrar.
  saveAll(seeds.filter((item) => item.userId !== currentUser.id))
}
