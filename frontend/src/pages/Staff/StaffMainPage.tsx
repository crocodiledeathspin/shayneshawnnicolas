import { useEffect } from 'react'
import StaffList from './components/StaffList'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { useToastMessage } from '../../hooks/useToastMessage'
import { useRefresh } from '../../hooks/useRefresh'

const StaffMainPage = () => {
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()
  const { refresh, handleRefresh } = useRefresh(false)

  useEffect(() => { document.title = 'Staff' }, [])

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Staff Management</h1>
      <StaffList refreshKey={refresh} onAction={showToastMessage} triggerRefresh={handleRefresh} />
    </>
  )
}

export default StaffMainPage
