// frontend/src/hooks/useGameLoop.ts
import { useEffect, useRef, RefObject } from 'react'
import { GameEngine } from '../game/GameEngine'
import { GameLoop } from '../game/GameLoop'
import { useGameStore } from '../stores/gameStore'

const HUD_UPDATE_INTERVAL_MS = 100 // 10fps

export function useGameLoop(canvasRef: RefObject<HTMLCanvasElement>) {
  const engineRef = useRef<GameEngine>(undefined)
  const jumpRef = useRef(false)
  const setHudState = useGameStore((s) => s.setHudState)

  if (!engineRef.current) {
    engineRef.current = new GameEngine()
  }

  useEffect(() => {
    const engine = engineRef.current!
    let lastHudUpdate = 0
    let rafId: number

    const loop = new GameLoop((dt) => {
      engine.update(dt, jumpRef.current)
      jumpRef.current = false
    })
    loop.start()

    const raf = (nowMs: number) => {
      loop.tick(nowMs)
      if (nowMs - lastHudUpdate >= HUD_UPDATE_INTERVAL_MS) {
        setHudState(engine.getSnapshot())
        lastHudUpdate = nowMs
      }
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      loop.stop()
      cancelAnimationFrame(rafId)
    }
  }, [setHudState])

  return {
    engine: engineRef.current,
    onJumpInput: () => {
      jumpRef.current = true
    },
  }
}
