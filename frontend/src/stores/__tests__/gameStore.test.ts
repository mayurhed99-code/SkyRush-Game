// frontend/src/stores/__tests__/gameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../gameStore'

describe('gameStore', () => {
  beforeEach(() => useGameStore.getState().reset())

  it('starts with a zeroed PLAYING state', () => {
    expect(useGameStore.getState().hudState).toEqual({
      score: 0, height: 0, maxCombo: 0, platformsBroken: 0, phase: 'PLAYING',
    })
  })

  it('updates hudState via setHudState', () => {
    useGameStore.getState().setHudState({ score: 500, height: 300, maxCombo: 3, platformsBroken: 1, phase: 'PLAYING' })
    expect(useGameStore.getState().hudState.score).toBe(500)
  })
})
