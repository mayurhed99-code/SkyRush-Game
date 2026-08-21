// frontend/src/game/GameLoop.ts
export class GameLoop {
  private lastMs: number | null = null
  private accumulatorSec = 0
  private running = true

  constructor(private update: (dt: number) => void, private fixedDt = 1 / 60) {}

  start() {
    this.running = true
    this.lastMs = null
    this.accumulatorSec = 0
  }

  stop() {
    this.running = false
  }

  tick(nowMs: number) {
    if (!this.running) return
    if (this.lastMs === null) {
      this.lastMs = nowMs
      return
    }
    const deltaSec = (nowMs - this.lastMs) / 1000
    this.lastMs = nowMs
    this.accumulatorSec += deltaSec
    while (this.accumulatorSec >= this.fixedDt) {
      this.update(this.fixedDt)
      this.accumulatorSec -= this.fixedDt
    }
  }
}
