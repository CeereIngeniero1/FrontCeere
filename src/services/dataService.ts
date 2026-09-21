import { initialAppointments } from '../data/appointments'
import { initialTasks } from '../data/tasks'
import { initialTimeEntries } from '../data/timeEntries'
import type { Appointment, Task, TimeEntry } from '../types'
import { readStorage, writeStorage } from './storage'

export function getTasks(): Task[] {
  return readStorage('tasks', initialTasks)
}

export function saveTasks(tasks: Task[]): void {
  writeStorage('tasks', tasks)
}

export function getAppointments(): Appointment[] {
  return readStorage('appointments', initialAppointments)
}

export function saveAppointments(appointments: Appointment[]): void {
  writeStorage('appointments', appointments)
}

export function getTimeEntries(): TimeEntry[] {
  return readStorage('timeEntries', initialTimeEntries)
}

export function saveTimeEntries(entries: TimeEntry[]): void {
  writeStorage('timeEntries', entries)
}
