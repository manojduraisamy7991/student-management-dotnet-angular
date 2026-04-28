import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getStoredUser, storeUser } from '../services/authService'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  setAuthenticatedUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser())

  const setAuthenticatedUser = useCallback((nextUser: User | null) => {
    storeUser(nextUser)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setAuthenticatedUser(null)
  }, [setAuthenticatedUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      setAuthenticatedUser,
      logout,
    }),
    [logout, setAuthenticatedUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
