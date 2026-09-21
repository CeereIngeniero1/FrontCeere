import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Table } from '../../components/ui/Table'
import { useAppointments, useTasks, useTimeEntries } from '../../hooks/useLocalData'
import { downloadCsv, formatMinutes, isDateInRange, todayISO } from '../../utils'

export function ReportsPage() {
  const { tasks } = useTasks()
  const { appointments } = useAppointments()
  const { entries } = useTimeEntries()
  const today = todayISO()

  const [from, setFrom] = useState('2026-09-01')
  const [to, setTo] = useState(today)

  const filteredTasks = useMemo(
    () => tasks.filter((task) => isDateInRange(task.dueDate, from, to)),
    [from, tasks, to],
  )
  const filteredAppointments = useMemo(
    () => appointments.filter((item) => isDateInRange(item.date, from, to)),
    [appointments, from, to],
  )
  const filteredEntries = useMemo(
    () => entries.filter((entry) => isDateInRange(entry.date, from, to)),
    [entries, from, to],
  )

  const created = filteredTasks.length
  const completed = filteredTasks.filter((task) => task.status === 'terminada').length
  const overdue = filteredTasks.filter(
    (task) => task.status !== 'terminada' && task.dueDate < today,
  ).length
  const timeTotal = filteredEntries.reduce((sum, entry) => sum + entry.totalMinutes, 0)

  const byAssignee = useMemo(() => {
    const map = new Map<
      string,
      { assignee: string; tasks: number; completed: number; hours: number }
    >()

    filteredTasks.forEach((task) => {
      const current = map.get(task.assignee) ?? {
        assignee: task.assignee,
        tasks: 0,
        completed: 0,
        hours: 0,
      }
      current.tasks += 1
      if (task.status === 'terminada') current.completed += 1
      map.set(task.assignee, current)
    })

    filteredEntries.forEach((entry) => {
      const assignee =
        entry.project.includes('Demo') || entry.project.includes('IPS')
          ? 'Carlos Ruiz'
          : entry.project.includes('Prospecto')
            ? 'Laura Méndez'
            : 'Ana Gómez'
      const current = map.get(assignee) ?? {
        assignee,
        tasks: 0,
        completed: 0,
        hours: 0,
      }
      current.hours += entry.totalMinutes
      map.set(assignee, current)
    })

    return Array.from(map.values())
  }, [filteredEntries, filteredTasks])

  const exportReport = () => {
    const rows: string[][] = [
      ['Sección', 'Métrica', 'Valor'],
      ['Resumen', 'Tareas creadas', String(created)],
      ['Resumen', 'Tareas terminadas', String(completed)],
      ['Resumen', 'Tareas vencidas', String(overdue)],
      ['Resumen', 'Tiempo registrado (min)', String(timeTotal)],
      ['Resumen', 'Actividades de agenda', String(filteredAppointments.length)],
      ['Filtro', 'Desde', from],
      ['Filtro', 'Hasta', to],
      [],
      ['Responsable', 'Tareas', 'Terminadas', 'Minutos'],
      ...byAssignee.map((row) => [
        row.assignee,
        String(row.tasks),
        String(row.completed),
        String(row.hours),
      ]),
    ]
    downloadCsv(`reporte-ceere-demo-${today}.csv`, rows)
  }

  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Indicadores demostrativos con filtro simulado por fecha y exportación CSV."
        actions={
          <Button onClick={exportReport}>Exportar reporte</Button>
        }
      />

      <Card style={{ marginBottom: '1rem' }}>
        <div className="filters-bar">
          <Input
            label="Desde"
            name="from"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          <Input
            label="Hasta"
            name="to"
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
      </Card>

      <div className="kpi-grid">
        <Card className="kpi-card">
          <span>Tareas creadas</span>
          <strong>{created}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Tareas terminadas</span>
          <strong>{completed}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Tareas vencidas</span>
          <strong>{overdue}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Tiempo registrado</span>
          <strong>{formatMinutes(timeTotal)}</strong>
        </Card>
        <Card className="kpi-card">
          <span>Actividades de agenda</span>
          <strong>{filteredAppointments.length}</strong>
        </Card>
      </div>

      <Card>
        <h2>Resumen por responsable</h2>
        <Table
          rows={byAssignee}
          rowKey={(row) => row.assignee}
          emptyMessage="No hay datos en el rango seleccionado."
          columns={[
            {
              key: 'assignee',
              header: 'Responsable',
              render: (row) => row.assignee,
            },
            {
              key: 'tasks',
              header: 'Tareas',
              render: (row) => row.tasks,
            },
            {
              key: 'completed',
              header: 'Terminadas',
              render: (row) => row.completed,
            },
            {
              key: 'hours',
              header: 'Tiempo',
              render: (row) => formatMinutes(row.hours),
            },
          ]}
        />
      </Card>
    </div>
  )
}
