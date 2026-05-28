import { useEffect, useState, type FC, type FormEvent } from 'react'
import Modal from '../../../components/Modal'
import FloatingLabelInput from '../../../components/Inputs/FloatingLabelInput'
import FloatingLabelSelect from '../../../components/Select/FloatingLabelSelect'
import SubmitButton from '../../../components/Button/SubmitButton'
import CategoryService from '../../../services/CategoryService'
import ProductService from '../../../services/ProductService'
import type { ProductColumns, ProductFieldErrors } from '../../../interfaces/ProductColumns'

interface Props {
  isOpen: boolean
  product: ProductColumns | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

const EditProductModal: FC<Props> = ({ isOpen, product, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<{ value: number; label: string }[]>([])
  const [form, setForm] = useState({ product_name: '', category: '', description: '', price: '', stock_qty: '', unit: '', reorder_level: '' })
  const [image, setImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<ProductFieldErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    CategoryService.loadCategories().then((res) => {
      setCategories((res.data.categories || []).map((c: { category_id: number; category_name: string }) => ({ value: c.category_id, label: c.category_name })))
    })
  }, [])

  useEffect(() => {
    if (product) {
      setForm({
        product_name: product.product_name,
        category: String(product.category_id),
        description: product.description || '',
        price: String(product.price),
        stock_qty: String(product.stock_qty),
        unit: product.unit,
        reorder_level: String(product.reorder_level),
      })
    }
  }, [product])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    const fd = new FormData()
    fd.append('product_name', form.product_name)
    fd.append('category', form.category)
    fd.append('description', form.description)
    fd.append('price', form.price)
    fd.append('stock_qty', form.stock_qty)
    fd.append('unit', form.unit)
    fd.append('reorder_level', form.reorder_level)
    if (image) fd.append('edit_product_image', image)
    try {
      const res = await ProductService.updateProduct(product.product_id, fd)
      onSuccess(res.data.message)
      onClose()
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data: { errors?: ProductFieldErrors } } }
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingLabelInput label="Product Name" name="product_name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} required errors={errors.product_name} />
        <FloatingLabelSelect label="Category" name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categories} required errors={errors.category} />
        <FloatingLabelInput label="Price (₱)" name="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required errors={errors.price} />
        <FloatingLabelInput label="Stock Quantity" name="stock_qty" type="number" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} required errors={errors.stock_qty} />
        <FloatingLabelInput label="Unit" name="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required errors={errors.unit} />
        <FloatingLabelInput label="Reorder Level" name="reorder_level" type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} required errors={errors.reorder_level} />
        <div>
          <label className="text-sm text-gray-600">New Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mt-1 w-full text-sm" />
        </div>
        <SubmitButton label="Update Product" loading={loading} />
      </form>
    </Modal>
  )
}

export default EditProductModal
