// frontend/src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends the httpOnly refresh cookie
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing: Promise<string | null> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true
      if (!refreshing) {
        refreshing = axios
          .post('/api/auth/refresh', {}, { withCredentials: true })
          .then((res) => {
            useAuthStore.getState().setAuth(res.data.accessToken, res.data.user)
            return res.data.accessToken as string
          })
          .catch(() => {
            useAuthStore.getState().clearAuth()
            return null
          })
          .finally(() => {
            refreshing = null
          })
      }
      const newToken = await refreshing
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }
    return Promise.reject(error)
  }
)
