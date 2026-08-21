// frontend/src/game/ComboSystem.ts
// Unified combo/multiplier model — single source of truth for client-side scoring.
// AntiCheatService.java mirrors these exact values.
export const MULTIPLIER_TABLE: Record<number, number> = {
  0: 1.0,
  1: 1.0,
  2: 1.5,
  3: 2.0,
  4: 2.5,
  5: 3.0, // cap — combo 5 and above all use this multiplier
}

export class ComboSystem {
  combo = 0

  onLanding(onNormalOrBreakablePlatform: boolean) {
    if (onNormalOrBreakablePlatform) {
      this.combo += 1
    } else {
      this.combo = 0
    }
  }

  onBreak() {
    this.combo = 0
  }

  getMultiplier(): number {
    const key = Math.min(this.combo, 5)
    return MULTIPLIER_TABLE[key]
  }
}
