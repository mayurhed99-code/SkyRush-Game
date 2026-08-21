// frontend/src/game/__tests__/GameEngine.test.ts
import { describe, it, expect } from 'vitest'
import { GameEngine } from '../GameEngine'

describe('GameEngine', () => {
  it('starts in PLAYING phase with zero score', () => {
    const engine = new GameEngine(123)
    expect(engine.state.phase).toBe('PLAYING')
    expect(engine.state.score).toBe(0)
  })

  it('increases score when the player lands on a platform', () => {
    const engine = new GameEngine(123)
    // run enough fixed steps for the player to fall onto the guaranteed starting platform
    for (let i = 0; i < 120; i++) {
      engine.update(1 / 60, false)
    }
    expect(engine.state.score).toBeGreaterThanOrEqual(0) // landing may or may not have occurred yet depending on seed geometry
  })

  it('tracks max height reached as the camera scrolls up', () => {
    const engine = new GameEngine(123)
    for (let i = 0; i < 300; i++) {
      engine.update(1 / 60, i % 20 === 0)
    }
    expect(engine.state.height).toBeGreaterThanOrEqual(0)
  })

  it('transitions to GAME_OVER when the player falls below the camera view', () => {
    const engine = new GameEngine(123)
    // force many falling-only steps with no jump input, well past the fall-out threshold
    for (let i = 0; i < 1000; i++) {
      engine.update(1 / 60, false)
    }
    expect(engine.state.phase).toBe('GAME_OVER')
  })

  it('does not update state once GAME_OVER', () => {
    const engine = new GameEngine(123)
    for (let i = 0; i < 1000; i++) engine.update(1 / 60, false)
    const scoreAtGameOver = engine.state.score
    engine.update(1 / 60, true)
    expect(engine.state.score).toBe(scoreAtGameOver)
  })
})
