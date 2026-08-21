// frontend/src/game/PlatformManager.ts
import { Rect } from './Collision'

export type PlatformType = 'NORMAL' | 'BREAKABLE'

export interface Platform extends Rect {
  id: number
  type: PlatformType
  broken: boolean
}

const PLATFORM_WIDTH = 80
const PLATFORM_HEIGHT = 16
const VERTICAL_GAP = 90
const GAME_WIDTH = 400
const SPAWN_AHEAD_PX = 1600 // how far above the camera to keep generating
const RECYCLE_BELOW_PX = 600 // recycle platforms this far below the camera

// Simple deterministic PRNG (mulberry32) so tests can assert determinism by seed.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class PlatformManager {
  platforms: Platform[] = []
  private nextId = 0
  private rand: () => number
  private highestSpawnedY: number

  constructor(seed = Date.now()) {
    this.rand = mulberry32(seed)
    this.highestSpawnedY = 500 // start spawning from near the ground
    this.spawnInitial()
  }

  private spawnInitial() {
    // guaranteed platform directly under spawn
    this.platforms.push(this.makePlatform(GAME_WIDTH / 2 - PLATFORM_WIDTH / 2, 550, 'NORMAL'))
    for (let i = 0; i < 15; i++) {
      this.spawnNext()
    }
  }

  private makePlatform(x: number, y: number, type: PlatformType): Platform {
    return { id: this.nextId++, x, y, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, type, broken: false }
  }

  private spawnNext() {
    const y = this.highestSpawnedY - VERTICAL_GAP
    const x = this.rand() * (GAME_WIDTH - PLATFORM_WIDTH)
    const type: PlatformType = this.rand() < 0.2 ? 'BREAKABLE' : 'NORMAL'
    this.platforms.push(this.makePlatform(x, y, type))
    this.highestSpawnedY = y
  }

  update(cameraY: number) {
    while (this.highestSpawnedY > cameraY - SPAWN_AHEAD_PX) {
      this.spawnNext()
    }
    const recycleThreshold = cameraY + RECYCLE_BELOW_PX + 400
    this.platforms = this.platforms.filter((p) => p.y < recycleThreshold)
  }

  breakPlatform(id: number) {
    const p = this.platforms.find((pl) => pl.id === id)
    if (p) p.broken = true
  }
}
