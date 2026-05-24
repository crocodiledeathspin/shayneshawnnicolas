import { useState, type FC, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FloatingLabelInput from '../../../components/Inputs/FloatingLabelInput'
import SubmitButton from '../../../components/Button/SubmitButton'
import { useAuth } from '../../../contexts/AuthContext'
import type { LoginCredentialsErrorFields } from '../../../interfaces/AuthInterface'

interface LoginFormProps {
  message: (message: string, isFailed?: boolean) => void
}

const LoginForm: FC<LoginFormProps> = ({ message }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginCredentialsErrorFields>({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data: { message?: string; errors?: LoginCredentialsErrorFields } } }
      if (err.response?.status === 401) {
        setErrors({})
        message(err.response.data.message || 'Login failed', true)
      } else if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <FloatingLabelInput
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          errors={errors?.username}
        />
      </div>
      <div className="mb-6">
        <FloatingLabelInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          errors={errors?.password}
        />
      </div>
      <SubmitButton
        label="Sign In"
        loading={isLoading}
        loadingLabel="Signing In..."
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
      />
      <p className="text-xs text-gray-500 mt-4 text-center">
        
      </p>
      <p className="text-center mt-4 pt-4 border-t">
        <Link to="/shop" className="text-orange-600 font-medium hover:underline">
          
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
