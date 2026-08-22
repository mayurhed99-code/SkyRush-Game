// frontend/src/hooks/__tests__/useLiveLeaderboard.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useLiveLeaderboard } from '../useLiveLeaderboard'

// Mock @stomp/stompjs and sockjs-client
vi.mock('@stomp/stompjs', () => {
  const mockClient = {
    activate: vi.fn(),
    deactivate: vi.fn(),
    subscribe: vi.fn(),
    onConnect: null as any,
  }
  function MockClient() { return mockClient }
  return { Client: MockClient }
})
vi.mock('sockjs-client', () => {
  function MockSockJS() { return {} }
  return { default: MockSockJS }
})

describe('useLiveLeaderboard', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  it('mounts and unmounts without errors', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)
    expect(() => {
      const { unmount } = renderHook(() => useLiveLeaderboard(), { wrapper })
      unmount()
    }).not.toThrow()
  })
})
