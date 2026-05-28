import { useEffect } from 'react'
import DebtList from './components/DebtList'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { useToastMessage } from '../../hooks/useToastMessage'
import { useRefresh } from '../../hooks/useRefresh'

const CustomerDebtsMainPage = () => {
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()
  const { refresh, handleRefresh } = useRefresh(false)

  useEffect(() => {
    document.title = 'Customer Debts - Jojo Store and Snackhouse'
  }, [])

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Debt Records</h1>
      <p className="text-sm text-gray-600 mb-6">
        Digital utang records for sari-sari and snack house customers. Only authorized staff can view and update entries.
      </p>
      <DebtList refreshKey={refresh} onAction={showToastMessage} triggerRefresh={handleRefresh} />
    </>
  )
}

export default CustomerDebtsMainPage
