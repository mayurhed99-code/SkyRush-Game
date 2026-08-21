// frontend/src/components/__tests__/Hud.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hud } from '../Hud'
import { useGameStore } from '../../stores/gameStore'

describe('Hud', () => {
  beforeEach(() => useGameStore.getState().reset())

  it('renders the current score from the store', () => {
    useGameStore.getState().setHudState({ score: 1234, height: 500, maxCombo: 3, platformsBroken: 2, phase: 'PLAYING' })
    render(<Hud />)
    expect(screen.getByText('1234')).toBeInTheDocument()
  })
})
