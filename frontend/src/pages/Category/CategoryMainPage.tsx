import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AddCategoryForm from './components/AddCategoryForm'
import CategoryList from './components/CategoryList'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { useToastMessage } from '../../hooks/useToastMessage'
import { useRefresh } from '../../hooks/useRefresh'

const CategoryMainPage = () => {
  const location = useLocation()
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()
  const { refresh, handleRefresh } = useRefresh(false)

  useEffect(() => { document.title = 'Categories' }, [])
  useEffect(() => {
    if (location.state?.message) {
      showToastMessage(location.state.message)
      handleRefresh()
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddCategoryForm onCategoryAdded={showToastMessage} refreshKey={handleRefresh} />
        <CategoryList refreshKey={refresh} />
      </div>
    </>
  )
}

export default CategoryMainPage
