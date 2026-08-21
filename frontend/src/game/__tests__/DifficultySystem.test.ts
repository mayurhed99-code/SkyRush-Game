// frontend/src/game/__tests__/DifficultySystem.test.ts
import { describe, it, expect } from 'vitest'
import { getBreakableChance, getVerticalGap } from '../DifficultySystem'

describe('DifficultySystem', () => {
  it('increases breakable chance with height, capped at 0.4', () => {
    expect(getBreakableChance(0)).toBeLessThan(getBreakableChance(5000))
    expect(getBreakableChance(100000)).toBeLessThanOrEqual(0.4)
  })

  it('increases vertical gap with height but never exceeds the max jumpable gap', () => {
    const low = getVerticalGap(0)
    const high = getVerticalGap(50000)
    expect(high).toBeGreaterThan(low)
    expect(high).toBeLessThanOrEqual(140) // max jumpable gap given JUMP_VELOCITY/GRAVITY
  })
})
