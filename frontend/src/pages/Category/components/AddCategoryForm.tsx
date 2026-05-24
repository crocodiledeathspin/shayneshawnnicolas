import { useState, type FC, type FormEvent } from 'react'
import FloatingLabelInput from '../../../components/Inputs/FloatingLabelInput'
import SubmitButton from '../../../components/Button/SubmitButton'
import CategoryService from '../../../services/CategoryService'
import type { CategoryFieldErrors } from '../../../interfaces/CategoryColumns'

interface Props {
  onCategoryAdded: (msg: string) => void
  refreshKey: () => void
}

const AddCategoryForm: FC<Props> = ({ onCategoryAdded, refreshKey }) => {
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<CategoryFieldErrors>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await CategoryService.storeCategory({ category_name: categoryName, description })
      onCategoryAdded(res.data.message)
      setCategoryName('')
      setDescription('')
      setErrors({})
      refreshKey()
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data: { errors?: CategoryFieldErrors } } }
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="font-semibold mb-4">Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <FloatingLabelInput label="Category Name" name="category_name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required errors={errors.category_name} />
        </div>
        <div className="mb-4">
          <FloatingLabelInput label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} errors={errors.description} />
        </div>
        <SubmitButton label="Save Category" loading={loading} />
      </form>
    </div>
  )
}

export default AddCategoryForm
