// frontend/src/components/__tests__/GameOverModal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameOverModal } from '../GameOverModal'

describe('GameOverModal', () => {
  const state = { score: 999, height: 1200, maxCombo: 5, platformsBroken: 3, phase: 'GAME_OVER' as const }

  it('shows the final score and calls onRetry when retry is clicked', () => {
    const onRetry = vi.fn()
    render(<GameOverModal state={state} onRetry={onRetry} onSubmit={vi.fn()} submitting={false} />)
    expect(screen.getByText('999')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('disables submit while submitting', () => {
    render(<GameOverModal state={state} onRetry={vi.fn()} onSubmit={vi.fn()} submitting={true} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })
})
