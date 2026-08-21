// frontend/src/stores/__tests__/authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  beforeEach(() => useAuthStore.getState().clearAuth())

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('stores accessToken and user on setAuth', () => {
    useAuthStore.getState().setAuth('token-abc', { id: 1, username: 'mayur', email: 'm@x.com', role: 'PLAYER', avatar: null })
    expect(useAuthStore.getState().accessToken).toBe('token-abc')
    expect(useAuthStore.getState().user?.username).toBe('mayur')
  })

  it('clears everything on clearAuth', () => {
    useAuthStore.getState().setAuth('token-abc', { id: 1, username: 'mayur', email: 'm@x.com', role: 'PLAYER', avatar: null })
    useAuthStore.getState().clearAuth()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
