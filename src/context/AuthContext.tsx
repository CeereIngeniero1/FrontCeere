import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loginRequest, logoutRequest, meRequest } from '../api/auth.api'
import { queryClient } from '../api/query-client'
import { setSessionExpiredHandler } from '../api/http-client'
import {
  clearDemoUser,
  demoLogin,
  isDemoAuthMode,
  readDemoUser,
} from '../features/auth/demoAuth'
import { ApiError } from '../types/api'
import type { AuthUser, LoginPayload } from '../types/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const isDemoMode = isDemoAuthMode()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const clearSession = useCallback(() => {
    setUser(null)
    if (isDemoMode) {
      clearDemoUser()
    }
    queryClient.clear()
  }, [isDemoMode])

  const refreshUser = useCallback(async () => {
    if (isDemoMode) {
      const demo = readDemoUser()
      setUser(demo)
      return demo
    }
    try {
      const me = await meRequest()
      setUser(me)
      return me
    } catch (error) {
      if (error instanceof ApiError && (error.isUnauthorized || error.status === 401)) {
        setUser(null)
        return null
      }
      throw error
    }
  }, [isDemoMode])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      setIsBootstrapping(true)
      try {
        if (isDemoMode) {
          if (!cancelled) setUser(readDemoUser())
          return
        }
        const me = await meRequest()
        if (!cancelled) setUser(me)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsBootstrapping(false)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [isDemoMode])

  useEffect(() => {
    if (isDemoMode) {
      setSessionExpiredHandler(null)
      return
    }
    setSessionExpiredHandler(() => {
      clearSession()
    })
    return () => setSessionExpiredHandler(null)
  }, [clearSession, isDemoMode])

  const login = useCallback(
    async (payload: LoginPayload) => {
      if (isDemoMode) {
        const demo = demoLogin(payload.email, payload.password)
        if (!demo) {
          throw new ApiError({
            message: 'Credenciales incorrectas.',
            status: 401,
          })
        }
        setUser(demo)
        return demo
      }

      const next = await loginRequest(payload)
      setUser(next)
      return next
    },
    [isDemoMode],
  )

  const logout = useCallback(async () => {
    try {
      if (!isDemoMode) {
        await logoutRequest()
      }
    } catch {
      // Aunque el API falle, se limpia el estado local.
    } finally {
      clearSession()
    }
  }, [clearSession, isDemoMode])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null && user.isActive,
      isBootstrapping,
      isDemoMode,
      login,
      logout,
      refreshUser,
    }),
    [user, isBootstrapping, isDemoMode, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
