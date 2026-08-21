// frontend/src/game/types.ts
export interface GameState {
  score: number
  height: number
  maxCombo: number
  platformsBroken: number
  phase: 'PLAYING' | 'GAME_OVER'
}
