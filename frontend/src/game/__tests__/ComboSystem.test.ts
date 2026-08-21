// frontend/src/game/__tests__/ComboSystem.test.ts
import { describe, it, expect } from 'vitest'
import { ComboSystem, MULTIPLIER_TABLE } from '../ComboSystem'

describe('ComboSystem', () => {
  it('starts at combo 0 with multiplier 1.0 (no combo yet)', () => {
    const c = new ComboSystem()
    expect(c.combo).toBe(0)
    expect(c.getMultiplier()).toBe(1.0)
  })

  it('increments combo on consecutive normal-platform landings', () => {
    const c = new ComboSystem()
    c.onLanding(true)
    c.onLanding(true)
    c.onLanding(true)
    expect(c.combo).toBe(3)
    expect(c.getMultiplier()).toBe(MULTIPLIER_TABLE[3])
  })

  it('caps the multiplier at combo 5+', () => {
    const c = new ComboSystem()
    for (let i = 0; i < 8; i++) c.onLanding(true)
    expect(c.getMultiplier()).toBe(MULTIPLIER_TABLE[5])
  })

  it('resets combo to 0 when landing on a broken/missed platform', () => {
    const c = new ComboSystem()
    c.onLanding(true)
    c.onLanding(true)
    c.onBreak()
    expect(c.combo).toBe(0)
    expect(c.getMultiplier()).toBe(1.0)
  })
})
