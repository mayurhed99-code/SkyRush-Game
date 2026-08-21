// frontend/src/stores/authStore.ts
import { create } from 'zustand'

export interface UserResponse {
  id: number
  username: string
  email: string
  role: string
  avatar: string | null
}

interface AuthStore {
  accessToken: string | null
  user: UserResponse | null
  setAuth: (accessToken: string, user: UserResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}))
