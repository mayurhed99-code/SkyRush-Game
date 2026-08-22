// frontend/src/pages/GamePage.tsx
import { useState, useCallback, useRef } from 'react'
import { GameCanvas } from '../components/GameCanvas'
import { Hud } from '../components/Hud'
import { GameOverModal } from '../components/GameOverModal'
import type { GameState } from '../game/types'
import { useAuthStore } from '../stores/authStore'
import { useGameStore } from '../stores/gameStore'
import { gameService } from '../services/gameService'

export function GamePage() {
  const [finalState, setFinalState] = useState<GameState | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const sessionIdRef = useRef<number | null>(null)
  const accessToken = useAuthStore(s => s.accessToken)
  const reset = useGameStore(s => s.reset)

  const handleGameStart = useCallback(async () => {
    if (!accessToken) return
    try {
      const { sessionId } = await gameService.startSession()
      sessionIdRef.current = sessionId
    } catch {
      // silently ignore — score can still be submitted if session start fails
    }
  }, [accessToken])

  const handleGameOver = useCallback((state: GameState) => {
    setFinalState(state)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!finalState || !sessionIdRef.current) return
    setSubmitting(true)
    try {
      await gameService.submitScore({
        sessionId: sessionIdRef.current,
        score: finalState.score,
        height: finalState.height,
        maxCombo: finalState.maxCombo,
        platformsBroken: finalState.platformsBroken,
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }, [finalState])

  const handleRetry = useCallback(() => {
    setFinalState(null)
    setSubmitted(false)
    reset()
    handleGameStart()
  }, [reset, handleGameStart])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
      <div className="relative">
        <Hud />
        <GameCanvas onGameOver={handleGameOver} />
        {finalState && (
          <GameOverModal
            state={finalState}
            onRetry={handleRetry}
            onSubmit={handleSubmit}
            submitting={submitting || submitted}
          />
        )}
      </div>
    </div>
  )
}
