// frontend/src/components/RegisterForm.tsx
import { useState, FormEvent } from 'react'

interface Props {
  onSubmit: (data: { username: string; email: string; password: string }) => void
  submitting: boolean
  error: string | null
}

export function RegisterForm({ onSubmit, submitting, error }: Props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ username, email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
      <label className="text-sm font-medium" htmlFor="reg-username">Username</label>
      <input id="reg-username" className="border rounded px-2 py-1" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label className="text-sm font-medium" htmlFor="reg-email">Email</label>
      <input id="reg-email" type="email" className="border rounded px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="text-sm font-medium" htmlFor="reg-password">Password</label>
      <input id="reg-password" type="password" className="border rounded px-2 py-1" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={submitting} className="bg-blue-600 text-white rounded py-2 disabled:opacity-50">
        {submitting ? 'Creating account…' : 'Register'}
      </button>
    </form>
  )
}
