// frontend/src/game/Collision.ts
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function aabbIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

const LANDING_TOLERANCE_PX = 24

export function isLandingOnTop(player: Rect, playerVelocityY: number, platform: Rect): boolean {
  if (playerVelocityY <= 0) return false // must be falling
  if (!aabbIntersect(player, platform)) return false
  const playerBottom = player.y + player.height
  return playerBottom - platform.y <= LANDING_TOLERANCE_PX
}
