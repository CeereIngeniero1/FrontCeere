import { useCallback, useEffect, useState } from 'react'
import { getSession, login as authLogin, logout as authLogout } from '../services/authService'
import type { AuthSession } from '../types'

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(() => getSession())

  useEffect(() => {
    setSession(getSession())
  }, [])

  const login = useCallback((email: string, password: string) => {
    const next = authLogin(email, password)
    setSession(next)
    return next
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setSession(null)
  }, [])

  return {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  }
}
