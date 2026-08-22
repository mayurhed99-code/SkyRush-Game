// frontend/src/game/GameEngine.ts
import { Player } from './Player'
import { Camera } from './Camera'
import { PlatformManager } from './PlatformManager'
import { ComboSystem } from './ComboSystem'
import { isLandingOnTop } from './Collision'
import { computeLandingPoints, computeHeightBonus, computeBreakBonus } from './ScoreSystem'
import type { GameState } from './types'

const FALL_OUT_MARGIN_PX = 700 // player is this far below the camera view => game over
const VIEWPORT_HEIGHT = 700

export class GameEngine {
  state: GameState = { score: 0, height: 0, maxCombo: 0, platformsBroken: 0, phase: 'PLAYING' }
  player: Player
  camera = new Camera()
  private platforms: PlatformManager
  private combo = new ComboSystem()
  private landedIds = new Set<number>()
  private lastHeightForBonus = 0

  constructor(seed = Date.now()) {
    this.player = new Player(160, 480)
    this.platforms = new PlatformManager(seed)
  }

  update(dt: number, jumpPressed: boolean) {
    if (this.state.phase === 'GAME_OVER') return

    if (jumpPressed && this.player.velocityY >= 0) {
      this.player.jump()
    }
    this.player.update(dt)
    this.camera.follow(this.player.y, dt)
    this.platforms.update(this.camera.y)

    const playerRect = this.player.toRect()
    for (const platform of this.platforms.platforms) {
      if (platform.broken) continue
      if (this.landedIds.has(platform.id)) continue
      if (isLandingOnTop(playerRect, this.player.velocityY, platform)) {
        this.landedIds.add(platform.id)
        this.player.velocityY = 0
        this.player.y = platform.y - this.player.height

        this.combo.onLanding(true)
        this.state.score += computeLandingPoints(this.combo.getMultiplier())
        this.state.maxCombo = Math.max(this.state.maxCombo, this.combo.combo)

        if (platform.type === 'BREAKABLE') {
          this.platforms.breakPlatform(platform.id)
          this.state.platformsBroken += 1
          this.state.score += computeBreakBonus(1) // bonus per break
        }
      }
    }

    const currentHeight = Math.max(0, -this.camera.y)
    if (currentHeight > this.state.height) {
      const newBonus = computeHeightBonus(currentHeight)
      const oldBonus = computeHeightBonus(this.lastHeightForBonus)
      this.state.score += newBonus - oldBonus
      this.lastHeightForBonus = currentHeight
      this.state.height = currentHeight
    }

    if (this.player.y > this.camera.y + VIEWPORT_HEIGHT + FALL_OUT_MARGIN_PX) {
      this.state.phase = 'GAME_OVER'
    }
  }

  getSnapshot(): GameState {
    return { ...this.state }
  }
}
