const STORAGE_KEYS = {
  tasks: 'ceere_demo_tasks',
  appointments: 'ceere_demo_appointments',
  timeEntries: 'ceere_demo_time_entries',
  dailyReports: 'ceere_demo_daily_reports',
} as const

export function readStorage<T>(key: keyof typeof STORAGE_KEYS, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key])
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: keyof typeof STORAGE_KEYS, value: T): void {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
}

export function removeStorage(key: keyof typeof STORAGE_KEYS): void {
  localStorage.removeItem(STORAGE_KEYS[key])
}

export { STORAGE_KEYS }
