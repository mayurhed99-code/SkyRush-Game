// frontend/src/components/__tests__/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  it('calls onSubmit with username and password', () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} submitting={false} error={null} />)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'mayur' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(onSubmit).toHaveBeenCalledWith({ username: 'mayur', password: 'secret123' })
  })

  it('shows an error message when provided', () => {
    render(<LoginForm onSubmit={vi.fn()} submitting={false} error="Invalid username or password" />)
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
  })
})
