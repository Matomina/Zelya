import axios from 'axios'
import type { ApiProfile, PaginatedProfiles, SearchResult } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request: inject access token ────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('zelya_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response: auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(err: unknown, token: string | null = null) {
  for (const p of failedQueue) {
    if (err) p.reject(err)
    else p.resolve(token!)
  }
  failedQueue = []
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status !== 401 || orig._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('zelya_refresh_token')
    const userId = localStorage.getItem('zelya_user_id')

    if (!refreshToken || !userId) return Promise.reject(error)

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        orig.headers.Authorization = `Bearer ${token}`
        return apiClient(orig)
      })
    }

    orig._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        userId,
        refreshToken,
      })
      localStorage.setItem('zelya_access_token', data.accessToken)
      localStorage.setItem('zelya_refresh_token', data.refreshToken)
      processQueue(null, data.accessToken)
      orig.headers.Authorization = `Bearer ${data.accessToken}`
      return apiClient(orig)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      localStorage.removeItem('zelya_access_token')
      localStorage.removeItem('zelya_refresh_token')
      localStorage.removeItem('zelya_user_id')
      localStorage.removeItem('zelya_user')
      window.location.href = '/connexion'
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  },
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: {
    email: string
    pseudo: string
    password: string
    dateOfBirth?: string
    acceptMarketing?: boolean
  }) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/login', data),

  logout: (refreshToken?: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  me: () =>
    apiClient.get<{ id: string; email: string; role: string; pseudo: string }>('/auth/me'),
}

// ─── Profiles ────────────────────────────────────────────────────────────────
export const profilesApi = {
  getAll: (params?: {
    gender?: string
    online?: boolean
    verified?: boolean
    premium?: boolean
    page?: number
    limit?: number
    sortBy?: string
    minAge?: number
    maxAge?: number
  }) => apiClient.get<PaginatedProfiles>('/profiles', { params }),

  getById: (id: string) => apiClient.get<ApiProfile>(`/profiles/${id}`),
}

// ─── Search ──────────────────────────────────────────────────────────────────
export const searchApi = {
  search: (params: {
    q: string
    gender?: string
    online?: boolean
    minAge?: number
    maxAge?: number
    page?: number
  }) => apiClient.get<SearchResult>('/search', { params }),
}

// ─── Favorites ───────────────────────────────────────────────────────────────
export const favoritesApi = {
  toggle: (profileId: string) =>
    apiClient.post<{ favorited: boolean; profileId: string }>(`/favorites/${profileId}`),

  getAll: (page = 1, limit = 24) =>
    apiClient.get('/favorites', { params: { page, limit } }),

  status: (profileId: string) =>
    apiClient.get<{ favorited: boolean }>(`/favorites/${profileId}/status`),
}
