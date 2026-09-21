import type { ActivityItem } from '../types'

export const recentActivity: ActivityItem[] = [
  {
    id: 'act-1',
    label: 'Ana Gómez actualizó la tarea de impresión',
    time: 'Hace 25 min',
    type: 'task',
  },
  {
    id: 'act-2',
    label: 'Se registró soporte con Clínica Demo Norte',
    time: 'Hace 1 h',
    type: 'support',
  },
  {
    id: 'act-3',
    label: 'Laura Méndez agendó demostración',
    time: 'Hace 2 h',
    type: 'meeting',
  },
  {
    id: 'act-4',
    label: 'Carlos Ruiz registró 3.5 h en IPS Horizonte',
    time: 'Ayer',
    type: 'time',
  },
  {
    id: 'act-5',
    label: 'Se cerró ticket de facturación',
    time: 'Ayer',
    type: 'support',
  },
]

export const dashboardBlocks = [
  {
    id: 'block-1',
    title: 'Esperando respuesta del cliente',
    detail: 'IPS Horizonte — inventario de insumos',
  },
  {
    id: 'block-2',
    title: 'Pendiente de ambiente de pruebas',
    detail: 'Prospecto Clínica Andina — demostración',
  },
]
