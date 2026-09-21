import { useEffect, useState } from 'react'

/** Temporizador informativo en cliente (la duración oficial la define el backend al detener). */
export function useElapsedTimer(startedAt: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!startedAt) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [startedAt])

  if (!startedAt) {
    return { elapsedMs: 0, label: '00:00:00' }
  }

  const elapsedMs = Math.max(0, now - new Date(startedAt).getTime())
  const totalSec = Math.floor(elapsedMs / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const label = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')

  return { elapsedMs, label }
}
