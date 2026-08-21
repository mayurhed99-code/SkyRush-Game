// frontend/src/components/GameCanvas.tsx
import { useEffect, useRef } from 'react'
import { useGameLoop } from '../hooks/useGameLoop'
import { useGameStore } from '../stores/gameStore'
import { GameState } from '../game/types'

interface Props {
  onGameOver: (finalState: GameState) => void
}

export function GameCanvas({ onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { onJumpInput, engine } = useGameLoop(canvasRef)
  const phase = useGameStore((s) => s.hudState.phase)

  useEffect(() => {
    if (phase === 'GAME_OVER') onGameOver(engine.getSnapshot())
  }, [phase, engine, onGameOver])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') onJumpInput()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onJumpInput])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={700}
      onPointerDown={onJumpInput}
      className="bg-sky-200 rounded shadow-inner touch-none"
    />
  )
}
