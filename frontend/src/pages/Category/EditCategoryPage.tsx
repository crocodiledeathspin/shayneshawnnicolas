import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../../components/Button/BackButton'
import FloatingLabelInput from '../../components/Inputs/FloatingLabelInput'
import SubmitButton from '../../components/Button/SubmitButton'
import CategoryService from '../../services/CategoryService'
import type { CategoryFieldErrors } from '../../interfaces/CategoryColumns'

const EditCategoryPage = () => {
  const { category_id } = useParams()
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<CategoryFieldErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    CategoryService.getCategory(Number(category_id)).then((res) => {
      setCategoryName(res.data.category.category_name)
      setDescription(res.data.category.description || '')
    })
  }, [category_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await CategoryService.updateCategory(Number(category_id), { category_name: categoryName, description })
      navigate('/categories', { state: { message: res.data.message } })
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data: { errors?: CategoryFieldErrors } } }
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border p-6">
      <BackButton to="/categories" />
      <h1 className="text-xl font-bold mt-4 mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4"><FloatingLabelInput label="Category Name" name="category_name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required errors={errors.category_name} /></div>
        <div className="mb-4"><FloatingLabelInput label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} errors={errors.description} /></div>
        <SubmitButton label="Update Category" loading={loading} />
      </form>
    </div>
  )
}

export default EditCategoryPage
