// frontend/src/game/ScoreSystem.ts
// Single source of truth for the run-score formula:
//   runScore = Σ landingPoints + heightBonus(height) + breakBonus(platformsBroken)
//   landingPoints = BASE_LANDING_POINTS × currentMultiplier (see ComboSystem.MULTIPLIER_TABLE)
// AntiCheatService.java mirrors these constants for plausibility bound-checking —
// keep both in sync if these numbers ever change.
export const BASE_LANDING_POINTS = 100
export const HEIGHT_BONUS_PER_100PX = 5
export const BREAK_BONUS_PER_PLATFORM = 25

export function computeLandingPoints(multiplier: number): number {
  return BASE_LANDING_POINTS * multiplier
}

export function computeHeightBonus(height: number): number {
  return Math.floor(height / 100) * HEIGHT_BONUS_PER_100PX
}

export function computeBreakBonus(platformsBroken: number): number {
  return platformsBroken * BREAK_BONUS_PER_PLATFORM
}
