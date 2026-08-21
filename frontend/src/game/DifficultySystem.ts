// frontend/src/game/DifficultySystem.ts
const MIN_GAP = 90
const MAX_GAP = 140 // derived from JUMP_VELOCITY=-620, GRAVITY=1400: max jump height ≈ v²/2g ≈ 137px
const MAX_BREAKABLE_CHANCE = 0.4

export function getBreakableChance(height: number): number {
  const t = Math.min(height / 20000, 1)
  return t * MAX_BREAKABLE_CHANCE
}

export function getVerticalGap(height: number): number {
  const t = Math.min(height / 20000, 1)
  return MIN_GAP + t * (MAX_GAP - MIN_GAP)
}
