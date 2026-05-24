import { useEffect } from 'react'
import ProductList from './components/ProductList'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { useToastMessage } from '../../hooks/useToastMessage'
import { useRefresh } from '../../hooks/useRefresh'

const ProductMainPage = () => {
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()
  const { refresh, handleRefresh } = useRefresh(false)

  useEffect(() => { document.title = 'Products' }, [])

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Inventory</h1>
      <ProductList refreshKey={refresh} onAction={showToastMessage} triggerRefresh={handleRefresh} />
    </>
  )
}

export default ProductMainPage
