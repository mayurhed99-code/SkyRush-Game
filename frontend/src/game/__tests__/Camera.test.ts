// frontend/src/game/__tests__/Camera.test.ts
import { describe, it, expect } from 'vitest'
import { Camera } from '../Camera'

describe('Camera', () => {
  it('follows the player upward once above the scroll threshold', () => {
    const c = new Camera()
    c.follow(-500, 1 / 60)
    expect(c.y).toBeLessThan(0)
  })

  it('never scrolls back down when the player falls slightly', () => {
    const c = new Camera()
    c.follow(-500, 1 / 60)
    const highestY = c.y
    c.follow(-100, 1 / 60) // player fell back down
    expect(c.y).toBeLessThanOrEqual(highestY)
  })
})
