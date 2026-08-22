// frontend/src/services/authService.ts
import { api } from './api'
import type { UserResponse } from '../stores/authStore'

interface AuthResponseBody {
  accessToken: string
  user: UserResponse
}

export const authService = {
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponseBody>('/auth/register', { username, email, password }).then((r) => r.data),
  login: (username: string, password: string) =>
    api.post<AuthResponseBody>('/auth/login', { username, password }).then((r) => r.data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<UserResponse>('/auth/me').then((r) => r.data),
}
