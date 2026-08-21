// frontend/src/game/__tests__/ScoreSystem.test.ts
import { describe, it, expect } from 'vitest'
import { computeLandingPoints, computeHeightBonus, computeBreakBonus, BASE_LANDING_POINTS } from '../ScoreSystem'

describe('ScoreSystem', () => {
  it('computes landing points as base points times multiplier', () => {
    expect(computeLandingPoints(1.0)).toBe(BASE_LANDING_POINTS)
    expect(computeLandingPoints(2.5)).toBe(BASE_LANDING_POINTS * 2.5)
  })

  it('computes a height bonus proportional to max height reached', () => {
    expect(computeHeightBonus(0)).toBe(0)
    expect(computeHeightBonus(1000)).toBeGreaterThan(computeHeightBonus(500))
  })

  it('computes a break bonus proportional to platforms broken', () => {
    expect(computeBreakBonus(0)).toBe(0)
    expect(computeBreakBonus(3)).toBeGreaterThan(computeBreakBonus(1))
  })
})
