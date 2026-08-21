// frontend/src/game/Camera.ts
const SCROLL_THRESHOLD_Y = 250 // keep player in the lower-middle of the viewport

export class Camera {
  y = 0

  follow(playerY: number, _dt: number) {
    const target = playerY - SCROLL_THRESHOLD_Y
    this.y = Math.min(this.y, target)
  }
}
