// frontend/src/pages/LoginPage.tsx
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { loginMutation } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex justify-center mt-16">
      <LoginForm
        submitting={loginMutation.isPending}
        error={loginMutation.isError ? 'Invalid username or password' : null}
        onSubmit={(creds) => loginMutation.mutate(creds, { onSuccess: () => navigate('/game') })}
      />
    </div>
  )
}
