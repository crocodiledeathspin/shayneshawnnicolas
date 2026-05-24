import { useEffect } from 'react'
import SaleList from './components/SaleList'
import RecordSaleForm from './components/RecordSaleForm'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { useToastMessage } from '../../hooks/useToastMessage'
import { useRefresh } from '../../hooks/useRefresh'

const SaleMainPage = () => {
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()
  const { refresh, handleRefresh } = useRefresh(false)

  useEffect(() => { document.title = 'Sales' }, [])

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Records</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RecordSaleForm onSaleRecorded={showToastMessage} refreshKey={handleRefresh} />
        </div>
        <div className="lg:col-span-2">
          <SaleList refreshKey={refresh} onCancel={showToastMessage} triggerRefresh={handleRefresh} />
        </div>
      </div>
    </>
  )
}

export default SaleMainPage
