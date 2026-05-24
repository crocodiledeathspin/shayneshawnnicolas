import { useEffect } from 'react'
import AuthPageLayout from './AuthPageLayout'
import LoginForm from './components/LoginForm'
import { useToastMessage } from '../../hooks/useToastMessage'
import ToastMessage from '../../components/ToastMessage/ToastMessage'

const LoginPage = () => {
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } =
    useToastMessage()

  useEffect(() => {
    document.title = "Aling Rosa's Store - Login"
  }, [])

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
