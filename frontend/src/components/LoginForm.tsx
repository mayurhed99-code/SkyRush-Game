// frontend/src/components/LoginForm.tsx
import { useState, FormEvent } from 'react'

interface Props {
  onSubmit: (creds: { username: string; password: string }) => void
  submitting: boolean
  error: string | null
}

export function LoginForm({ onSubmit, submitting, error }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
      <label className="text-sm font-medium" htmlFor="username">Username</label>
      <input id="username" className="border rounded px-2 py-1" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label className="text-sm font-medium" htmlFor="password">Password</label>
      <input id="password" type="password" className="border rounded px-2 py-1" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={submitting} className="bg-blue-600 text-white rounded py-2 disabled:opacity-50">
        {submitting ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}
