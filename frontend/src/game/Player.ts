// frontend/src/game/Player.ts
import { applyGravity, integratePosition, JUMP_VELOCITY } from './Physics'
import type { Rect } from './Collision'

export class Player {
  velocityY = 0
  width = 30
  height = 30

  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  jump() {
    this.velocityY = JUMP_VELOCITY
  }

  update(dt: number) {
    this.velocityY = applyGravity(this.velocityY, dt)
    this.y = integratePosition(this.y, this.velocityY, dt)
  }

  toRect(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }
}
