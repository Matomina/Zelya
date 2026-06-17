import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface AdminUser {
  id: string
  pseudo: string
  email: string
  role: 'ADMIN' | 'MODERATOR'
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('zelya_admin_token')
    if (!token) { setLoading(false); return }

    api.get<AdminUser>('/auth/me')
      .then(r => {
        if (r.data.role !== 'ADMIN' && r.data.role !== 'MODERATOR') {
          localStorage.removeItem('zelya_admin_token')
          setUser(null)
        } else {
          setUser(r.data)
        }
      })
      .catch(() => { localStorage.removeItem('zelya_admin_token'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const r = await api.post<{ accessToken: string }>('/auth/login', { email, password })
    localStorage.setItem('zelya_admin_token', r.data.accessToken)
    window.location.href = '/'
  }

  const logout = () => {
    localStorage.removeItem('zelya_admin_token')
    api.post('/auth/logout').catch(() => {})
    window.location.href = '/login'
  }

  return { user, loading, login, logout }
}
