// frontend/src/game/__tests__/GameLoop.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GameLoop } from '../GameLoop'

describe('GameLoop', () => {
  it('calls update with a fixed dt once per accumulated step', () => {
    const update = vi.fn()
    const loop = new GameLoop(update, 1 / 60)
    loop.tick(0)
    loop.tick(1000 / 60) // exactly one fixed step later
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(1 / 60)
  })

  it('accumulates multiple steps when a frame is slow', () => {
    const update = vi.fn()
    const loop = new GameLoop(update, 1 / 60)
    loop.tick(0)
    loop.tick(1000 / 60 * 3.5) // 3.5 steps worth of time passed
    expect(update).toHaveBeenCalledTimes(3) // partial step carried over, not called
  })

  it('does not call update before start via tick if stopped', () => {
    const update = vi.fn()
    const loop = new GameLoop(update, 1 / 60)
    loop.stop()
    loop.tick(0)
    loop.tick(1000)
    expect(update).not.toHaveBeenCalled()
  })
})
