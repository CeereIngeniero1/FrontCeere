import { useCallback, useState } from 'react'
import {
  getAppointments,
  getTasks,
  getTimeEntries,
  saveAppointments,
  saveTasks,
  saveTimeEntries,
} from '../services/dataService'
import type { Appointment, Task, TimeEntry } from '../types'
import { createId } from '../utils'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks())

  const persist = useCallback((next: Task[]) => {
    setTasks(next)
    saveTasks(next)
  }, [])

  const createTask = useCallback(
    (data: Omit<Task, 'id'>) => {
      persist([{ ...data, id: createId('task') }, ...tasks])
    },
    [persist, tasks],
  )

  const updateTask = useCallback(
    (id: string, data: Partial<Task>) => {
      persist(tasks.map((task) => (task.id === id ? { ...task, ...data } : task)))
    },
    [persist, tasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      persist(tasks.filter((task) => task.id !== id))
    },
    [persist, tasks],
  )

  return { tasks, createTask, updateTask, deleteTask }
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getAppointments(),
  )

  const persist = useCallback((next: Appointment[]) => {
    setAppointments(next)
    saveAppointments(next)
  }, [])

  const createAppointment = useCallback(
    (data: Omit<Appointment, 'id'>) => {
      persist([{ ...data, id: createId('appt') }, ...appointments])
    },
    [appointments, persist],
  )

  const deleteAppointment = useCallback(
    (id: string) => {
      persist(appointments.filter((item) => item.id !== id))
    },
    [appointments, persist],
  )

  return { appointments, createAppointment, deleteAppointment }
}

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>(() => getTimeEntries())

  const persist = useCallback((next: TimeEntry[]) => {
    setEntries(next)
    saveTimeEntries(next)
  }, [])

  const createEntry = useCallback(
    (data: Omit<TimeEntry, 'id'>) => {
      persist([{ ...data, id: createId('time') }, ...entries])
    },
    [entries, persist],
  )

  const deleteEntry = useCallback(
    (id: string) => {
      persist(entries.filter((item) => item.id !== id))
    },
    [entries, persist],
  )

  return { entries, createEntry, deleteEntry }
}
