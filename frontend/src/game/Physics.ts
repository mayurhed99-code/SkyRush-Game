// frontend/src/game/Physics.ts
// Physics constants (single source of truth for client-side physics):
//   GRAVITY = 1400 px/s^2
//   JUMP_VELOCITY = -620 px/s (negative = upward)
//   MAX_FALL_SPEED = 900 px/s
// These exact values are mirrored in AntiCheatService.java's comment block.
export const GRAVITY = 1400 // px/s^2
export const JUMP_VELOCITY = -620 // px/s, negative = upward
export const MAX_FALL_SPEED = 900 // px/s

export function applyGravity(velocityY: number, dt: number): number {
  const next = velocityY + GRAVITY * dt
  return Math.min(next, MAX_FALL_SPEED)
}

export function integratePosition(pos: number, velocity: number, dt: number): number {
  return pos + velocity * dt
}
