import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '@/lib/api'
import type { ApiUser } from '@/types/api'

interface AuthContextValue {
  user: ApiUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

interface RegisterData {
  email: string
  pseudo: string
  password: string
  dateOfBirth?: string
  acceptMarketing?: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function storeTokens(accessToken: string, refreshToken: string, userId: string) {
  localStorage.setItem('zelya_access_token', accessToken)
  localStorage.setItem('zelya_refresh_token', refreshToken)
  localStorage.setItem('zelya_user_id', userId)
}

function clearTokens() {
  localStorage.removeItem('zelya_access_token')
  localStorage.removeItem('zelya_refresh_token')
  localStorage.removeItem('zelya_user_id')
  localStorage.removeItem('zelya_user')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await authApi.me()
      const apiUser: ApiUser = {
        id: data.id,
        email: data.email,
        role: data.role as ApiUser['role'],
        pseudo: data.pseudo,
      }
      setUser(apiUser)
      return apiUser
    } catch {
      clearTokens()
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('zelya_access_token')
    if (!token) {
      setIsLoading(false)
      return
    }
    fetchMe().finally(() => setIsLoading(false))
  }, [fetchMe])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password })
    // Decode userId from JWT payload (sub field)
    const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
    storeTokens(data.accessToken, data.refreshToken, payload.sub)
    await fetchMe()
  }, [fetchMe])

  const register = useCallback(async (registerData: RegisterData) => {
    const { data } = await authApi.register(registerData)
    const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
    storeTokens(data.accessToken, data.refreshToken, payload.sub)
    await fetchMe()
  }, [fetchMe])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('zelya_refresh_token')
    try {
      await authApi.logout(refreshToken ?? undefined)
    } catch {
      // ignore errors during logout
    }
    clearTokens()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
