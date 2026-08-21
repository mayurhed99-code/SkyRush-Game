// frontend/src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const { accessToken, user, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authService.login(username, password),
    onSuccess: (data) => useAuthStore.getState().setAuth(data.accessToken, data.user),
  })

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      authService.register(username, email, password),
    onSuccess: (data) => useAuthStore.getState().setAuth(data.accessToken, data.user),
  })

  const logout = async () => {
    await authService.logout()
    clearAuth()
  }

  return { accessToken, user, isAuthenticated: !!accessToken, loginMutation, registerMutation, logout }
}
