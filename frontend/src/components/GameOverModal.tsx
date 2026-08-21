// frontend/src/components/GameOverModal.tsx
import { GameState } from '../game/types'

interface Props {
  state: GameState
  onRetry: () => void
  onSubmit: () => void
  submitting: boolean
}

export function GameOverModal({ state, onRetry, onSubmit, submitting }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg p-6 w-72 text-center">
        <h2 className="text-lg font-bold mb-2">Game Over</h2>
        <div className="text-3xl font-extrabold mb-4">{state.score}</div>
        <p className="text-sm text-gray-600 mb-4">Height: {Math.floor(state.height)}m · Best combo: {state.maxCombo}</p>
        <button
          className="w-full mb-2 bg-blue-600 text-white rounded py-2 disabled:opacity-50"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit score'}
        </button>
        <button className="w-full bg-gray-200 rounded py-2" onClick={onRetry}>
          Retry
        </button>
      </div>
    </div>
  )
}
