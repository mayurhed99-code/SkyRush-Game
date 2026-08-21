// frontend/src/pages/RegisterPage.tsx
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const { registerMutation } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex justify-center mt-16">
      <RegisterForm
        submitting={registerMutation.isPending}
        error={registerMutation.isError ? 'Registration failed — username or email may already be taken' : null}
        onSubmit={(data) => registerMutation.mutate(data, { onSuccess: () => navigate('/game') })}
      />
    </div>
  )
}
