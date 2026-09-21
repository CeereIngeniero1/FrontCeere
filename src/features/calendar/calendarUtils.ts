import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseISODate(value: string): Date {
  return parseISO(value)
}

export function monthLabel(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: es })
}

export function weekLabel(start: Date, end: Date): string {
  return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`
}

export function dayLabel(date: Date): string {
  return format(date, "EEEE d 'de' MMMM yyyy", { locale: es })
}

export function buildMonthCells(cursor: Date): Array<{
  date: string
  day: number
  outside: boolean
  dateObj: Date
}> {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end }).map((dateObj) => ({
    date: toISODate(dateObj),
    day: dateObj.getDate(),
    outside: !isSameMonth(dateObj, cursor),
    dateObj,
  }))
}

export function buildWeekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end: endOfWeek(anchor, { weekStartsOn: 1 }) })
}

export function shortDayLabel(date: Date): string {
  return format(date, "EEE d MMM", { locale: es })
}

export function shiftCursor(
  cursor: Date,
  view: 'month' | 'week' | 'day',
  direction: -1 | 1,
): Date {
  if (view === 'month') {
    return addMonths(cursor, direction)
  }
  if (view === 'week') {
    return addDays(cursor, direction * 7)
  }
  return addDays(cursor, direction)
}

export function isToday(date: Date | string): boolean {
  const value = typeof date === 'string' ? parseISODate(date) : date
  return isSameDay(value, new Date())
}
