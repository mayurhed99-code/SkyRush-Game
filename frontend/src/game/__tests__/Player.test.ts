// frontend/src/game/__tests__/Player.test.ts
import { describe, it, expect } from 'vitest'
import { Player } from '../Player'
import { JUMP_VELOCITY } from '../Physics'

describe('Player', () => {
  it('falls under gravity each update', () => {
    const p = new Player(100, 100)
    const y0 = p.y
    p.update(1 / 60)
    expect(p.y).toBeGreaterThan(y0)
  })

  it('sets upward velocity on jump', () => {
    const p = new Player(100, 100)
    p.jump()
    expect(p.velocityY).toBe(JUMP_VELOCITY)
  })

  it('exposes an AABB rect matching position and size', () => {
    const p = new Player(50, 60)
    const rect = p.toRect()
    expect(rect.x).toBe(50)
    expect(rect.y).toBe(60)
    expect(rect.width).toBeGreaterThan(0)
    expect(rect.height).toBeGreaterThan(0)
  })
})
