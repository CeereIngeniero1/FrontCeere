import type { AppointmentType, TaskPriority, TaskStatus } from '../../types'
import {
  appointmentLabels,
  priorityLabels,
  statusLabels,
} from '../../utils/labels'

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`badge badge-status badge-${status}`}>
      {statusLabels[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`badge badge-priority badge-priority-${priority}`}>
      {priorityLabels[priority]}
    </span>
  )
}

export function AppointmentBadge({ type }: { type: AppointmentType }) {
  return (
    <span className={`badge badge-appt badge-appt-${type}`}>
      {appointmentLabels[type]}
    </span>
  )
}
