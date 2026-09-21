import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/feedback/QueryState'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Table } from '../../components/ui/Table'
import { ROLE_LABELS } from '../auth/permissions'
import { useUserMutations, useUsersQuery } from '../../hooks/useAdminData'
import { ApiError } from '../../types/api'
import type { ManagedUser } from '../../types/users'
import type { UserRole } from '../../types/auth'
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormInput,
  type CreateUserFormValues,
  type UpdateUserFormInput,
  type UpdateUserFormValues,
} from './userFormSchema'

export function UsersView() {
  const query = useUsersQuery(true)
  const { createMutation, updateMutation } = useUserMutations()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<ManagedUser | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const createForm = useForm<CreateUserFormInput, unknown, CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'MEMBER',
      temporaryPassword: '',
    },
  })

  const editForm = useForm<UpdateUserFormInput, unknown, UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'MEMBER',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!editing) return
    editForm.reset({
      name: editing.name,
      email: editing.email,
      role: editing.role,
      isActive: editing.isActive,
    })
  }, [editing, editForm])

  const handleCreate = createForm.handleSubmit(async (values) => {
    setErrorMessage('')
    try {
      await createMutation.mutateAsync(values)
      setCreateOpen(false)
      createForm.reset({
        name: '',
        email: '',
        role: 'MEMBER',
        temporaryPassword: '',
      })
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'No se pudo crear el usuario.',
      )
    }
  })

  const handleUpdate = editForm.handleSubmit(async (values) => {
    if (!editing) return
    setErrorMessage('')
    try {
      await updateMutation.mutateAsync({ id: editing.id, payload: values })
      setEditing(null)
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'No se pudo actualizar el usuario.',
      )
    }
  })

  const toggleActive = async (user: ManagedUser) => {
    const action = user.isActive ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Seguro que desea ${action} a ${user.name}?`)) return
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        payload: {
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: !user.isActive,
        },
      })
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : `No se pudo ${action} el usuario.`,
      )
    }
  }

  if (query.isLoading) return <LoadingState label="Cargando usuarios…" />
  if (query.isError) {
    return (
      <ErrorState
        message={
          query.error instanceof ApiError
            ? query.error.message
            : 'No se pudieron cargar los usuarios.'
        }
        onRetry={() => void query.refetch()}
      />
    )
  }

  const users = query.data?.items ?? []
  const roleOptions = (Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
  }))

  return (
    <div>
      <PageHeader
        title="Configuración · Usuarios"
        description="Alta y edición de usuarios. Las contraseñas nunca se muestran."
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Crear usuario
          </Button>
        }
      />

      {query.data?.isDemoData ? (
        <p className="demo-inline" role="note">
          Datos DEMO temporales. API prevista: <code>/users</code>. La contraseña
          temporal solo se usa al crear y no se almacena en el cliente.
        </p>
      ) : null}

      {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}

      {users.length === 0 ? (
        <EmptyState title="No hay usuarios" />
      ) : (
        <Table
          rows={users}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'name',
              header: 'Nombre',
              render: (row) => row.name,
            },
            {
              key: 'email',
              header: 'Correo',
              render: (row) => row.email,
            },
            {
              key: 'role',
              header: 'Rol',
              render: (row) => ROLE_LABELS[row.role],
            },
            {
              key: 'status',
              header: 'Estado',
              render: (row) => (row.isActive ? 'Activo' : 'Inactivo'),
            },
            {
              key: 'actions',
              header: 'Acciones',
              render: (row) => (
                <div className="inline-actions">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setErrorMessage('')
                      setEditing(row)
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant={row.isActive ? 'danger' : 'outline'}
                    type="button"
                    onClick={() => void toggleActive(row)}
                  >
                    {row.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        open={createOpen}
        title="Crear usuario"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-user-form"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creando…' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="create-user-form" onSubmit={(e) => void handleCreate(e)} noValidate>
          <Alert variant="info">
            La contraseña temporal no se volverá a mostrar después de crear el usuario.
          </Alert>
          <Input
            label="Nombre"
            {...createForm.register('name')}
            error={createForm.formState.errors.name?.message}
            required
          />
          <Input
            label="Correo"
            type="email"
            {...createForm.register('email')}
            error={createForm.formState.errors.email?.message}
            required
          />
          <Select
            label="Rol"
            {...createForm.register('role')}
            options={roleOptions}
            error={createForm.formState.errors.role?.message}
          />
          <Input
            label="Contraseña temporal"
            type="password"
            autoComplete="new-password"
            {...createForm.register('temporaryPassword')}
            error={createForm.formState.errors.temporaryPassword?.message}
            required
          />
        </form>
      </Modal>

      <Modal
        open={Boolean(editing)}
        title="Editar usuario"
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="edit-user-form"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Guardando…' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form id="edit-user-form" onSubmit={(e) => void handleUpdate(e)} noValidate>
          <Input
            label="Nombre"
            {...editForm.register('name')}
            error={editForm.formState.errors.name?.message}
            required
          />
          <Input
            label="Correo"
            type="email"
            {...editForm.register('email')}
            error={editForm.formState.errors.email?.message}
            required
          />
          <Select
            label="Rol"
            {...editForm.register('role')}
            options={roleOptions}
            error={editForm.formState.errors.role?.message}
          />
          <label className="filter-check">
            <input type="checkbox" {...editForm.register('isActive')} />
            Usuario activo
          </label>
        </form>
      </Modal>
    </div>
  )
}
