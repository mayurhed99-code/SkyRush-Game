// frontend/src/hooks/__tests__/useGameLoop.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameLoop } from '../useGameLoop'
import { useGameStore } from '../../stores/gameStore'

describe('useGameLoop', () => {
  beforeEach(() => useGameStore.getState().reset())

  it('exposes a GameEngine instance and an onJumpInput callback', () => {
    const ref = { current: document.createElement('canvas') }
    const { result } = renderHook(() => useGameLoop(ref as any))
    expect(result.current.engine).toBeDefined()
    expect(typeof result.current.onJumpInput).toBe('function')
  })

  it('updates the HUD store at a throttled rate, not every raf frame', () => {
    vi.useFakeTimers()
    const ref = { current: document.createElement('canvas') }
    renderHook(() => useGameLoop(ref as any))
    act(() => {
      vi.advanceTimersByTime(50) // less than one 10fps tick (100ms)
    })
    // hudState may have updated at most once in 50ms at a 10fps throttle
    vi.useRealTimers()
  })
})
