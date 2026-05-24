import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import AuthPageLayout from './AuthPageLayout'
import LoginForm from './components/LoginForm'
import { useAuth } from '../../contexts/AuthContext'
import { useToastMessage } from '../../hooks/useToastMessage'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import Spinner from '../../components/Spinner/Spinner'

const LoginPage = () => {
  const { user, loading } = useAuth()
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } =
    useToastMessage()

  useEffect(() => {
    document.title = "Aling Rosa's Store - Login"
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (user?.user_id) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthPageLayout>
      <ToastMessage
        message={message}
        isVisible={isVisible}
        isFailed={isFailed}
        onClose={closeToastMessage}
      />
      <LoginForm message={showToastMessage} />
    </AuthPageLayout>
  )
}

export default LoginPage
