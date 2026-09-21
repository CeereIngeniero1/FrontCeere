import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from '../api/tasks.api'
import { queryKeys } from '../api/query-client'
import type { TaskFilters, TaskWritePayload } from '../types/tasks'

export function useTasksQuery(filters: TaskFilters) {
  return useQuery({
    queryKey: [...queryKeys.tasks.list, filters],
    queryFn: ({ signal }) => listTasks(filters, signal),
  })
}

export function useTaskMutations() {
  const queryClient = useQueryClient()

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.personal }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.team }),
    ])
  }

  const createMutation = useMutation({
    mutationFn: (payload: TaskWritePayload) => createTask(payload),
    onSuccess: () => void invalidate(),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<TaskWritePayload>
    }) => updateTask(id, payload),
    onSuccess: () => void invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => void invalidate(),
  })

  return { createMutation, updateMutation, deleteMutation }
}
