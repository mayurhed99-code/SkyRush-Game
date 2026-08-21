// frontend/src/components/Hud.tsx
import { useGameStore } from '../stores/gameStore'

export function Hud() {
  const { score, height, maxCombo } = useGameStore((s) => s.hudState)
  return (
    <div className="absolute top-4 left-4 text-white font-bold text-xl drop-shadow">
      <div>{score}</div>
      <div className="text-sm font-normal">Height: {Math.floor(height)}m</div>
      <div className="text-sm font-normal">Max combo: {maxCombo}</div>
    </div>
  )
}
