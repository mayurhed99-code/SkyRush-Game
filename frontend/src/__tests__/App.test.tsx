// frontend/src/__tests__/App.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the SkyRush home page', () => {
    render(<App />)
    expect(screen.getByText('SkyRush')).toBeInTheDocument()
  })
})
