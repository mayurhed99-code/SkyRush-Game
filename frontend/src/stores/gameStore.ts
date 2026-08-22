// frontend/src/stores/gameStore.ts
import { create } from 'zustand'
import type { GameState } from '../game/types'

interface GameStore {
  hudState: GameState
  setHudState: (s: GameState) => void
  reset: () => void
}

const initial: GameState = { score: 0, height: 0, maxCombo: 0, platformsBroken: 0, phase: 'PLAYING' }

export const useGameStore = create<GameStore>((set) => ({
  hudState: initial,
  setHudState: (s) => set({ hudState: s }),
  reset: () => set({ hudState: initial }),
}))
