import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../../components/Button/BackButton'
import SubmitButton from '../../components/Button/SubmitButton'
import CategoryService from '../../services/CategoryService'

const DeleteCategoryPage = () => {
  const { category_id } = useParams()
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    CategoryService.getCategory(Number(category_id)).then((res) => {
      setCategoryName(res.data.category.category_name)
    })
  }, [category_id])

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await CategoryService.destroyCategory(Number(category_id))
      navigate('/categories', { state: { message: res.data.message } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border p-6">
      <BackButton to="/categories" />
      <h1 className="text-xl font-bold mt-4 mb-4 text-red-600">Delete Category</h1>
      <p className="mb-6">Are you sure you want to delete <strong>{categoryName}</strong>?</p>
      <form onSubmit={handleDelete}>
        <SubmitButton label="Confirm Delete" loading={loading} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl" />
      </form>
    </div>
  )
}

export default DeleteCategoryPage
