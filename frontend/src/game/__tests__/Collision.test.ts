// frontend/src/game/__tests__/Collision.test.ts
import { describe, it, expect } from 'vitest'
import { aabbIntersect, isLandingOnTop, Rect } from '../Collision'

describe('Collision', () => {
  const platform: Rect = { x: 100, y: 200, width: 80, height: 16 }

  it('detects overlapping rectangles', () => {
    const player: Rect = { x: 110, y: 190, width: 30, height: 30 }
    expect(aabbIntersect(player, platform)).toBe(true)
  })

  it('detects non-overlapping rectangles', () => {
    const player: Rect = { x: 500, y: 500, width: 30, height: 30 }
    expect(aabbIntersect(player, platform)).toBe(false)
  })

  it('counts a landing only when falling onto the platform top from above', () => {
    const playerAbove: Rect = { x: 110, y: 191, width: 30, height: 30 } // bottom edge at 221, platform top at 200
    expect(isLandingOnTop(playerAbove, 300, platform)).toBe(true) // falling (velocity > 0)
  })

  it('does not count a landing while moving upward through the platform', () => {
    const playerAbove: Rect = { x: 110, y: 191, width: 30, height: 30 }
    expect(isLandingOnTop(playerAbove, -300, platform)).toBe(false)
  })

  it('does not count a landing when overlapping from the side, not the top', () => {
    const playerSide: Rect = { x: 170, y: 205, width: 30, height: 30 }
    expect(isLandingOnTop(playerSide, 300, platform)).toBe(false)
  })
})
