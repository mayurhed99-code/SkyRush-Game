// frontend/src/game/__tests__/Physics.test.ts
import { describe, it, expect } from 'vitest'
import { applyGravity, integratePosition, GRAVITY, JUMP_VELOCITY, MAX_FALL_SPEED } from '../Physics'

describe('Physics', () => {
  it('applies gravity to increase downward velocity over time', () => {
    const v0 = 0
    const v1 = applyGravity(v0, 1 / 60)
    expect(v1).toBeCloseTo(GRAVITY * (1 / 60))
  })

  it('caps velocity at MAX_FALL_SPEED', () => {
    const v = applyGravity(MAX_FALL_SPEED, 1)
    expect(v).toBe(MAX_FALL_SPEED)
  })

  it('integrates position using velocity and dt', () => {
    const p1 = integratePosition(100, 50, 1 / 60)
    expect(p1).toBeCloseTo(100 + 50 * (1 / 60))
  })

  it('defines a negative jump velocity (upward)', () => {
    expect(JUMP_VELOCITY).toBeLessThan(0)
  })
})
