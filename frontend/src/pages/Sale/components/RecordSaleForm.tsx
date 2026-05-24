import { useEffect, useState, type FC, type FormEvent } from 'react'
import FloatingLabelInput from '../../../components/Inputs/FloatingLabelInput'
import FloatingLabelSelect from '../../../components/Select/FloatingLabelSelect'
import SubmitButton from '../../../components/Button/SubmitButton'
import ProductService from '../../../services/ProductService'
import SaleService from '../../../services/SaleService'
import type { SaleFieldErrors } from '../../../interfaces/SaleColumns'

interface Props {
  onSaleRecorded: (msg: string, failed?: boolean) => void
  refreshKey: boolean
  triggerRefresh: () => void
}

const RecordSaleForm: FC<Props> = ({ onSaleRecorded, refreshKey, triggerRefresh }) => {
  const [products, setProducts] = useState<{ value: number; label: string }[]>([])
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<SaleFieldErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ProductService.loadProducts(1, '').then((res) => {
      setProducts((res.data.products || []).map((p: { product_id: number; product_name: string; stock_qty: number; price: number }) => ({
        value: p.product_id,
        label: `${p.product_name} (₱${Number(p.price).toFixed(2)} | Stock: ${p.stock_qty})`,
      })))
    })
  }, [refreshKey])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await SaleService.storeSale({ product: Number(product), quantity: Number(quantity), notes })
      onSaleRecorded(res.data.message)
      setProduct('')
      setQuantity('1')
      setNotes('')
      setErrors({})
      triggerRefresh()
    } catch (error: unknown) {
      const err = error as { response?: { status: number; data: { message?: string; errors?: SaleFieldErrors } } }
      if (err.response?.status === 422) {
        if (err.response.data.errors) setErrors(err.response.data.errors)
        else onSaleRecorded(err.response.data.message || 'Error', true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="font-semibold mb-4">Record Sale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingLabelSelect label="Product" name="product" value={product} onChange={(e) => setProduct(e.target.value)} options={products} required errors={errors.product} />
        <FloatingLabelInput label="Quantity" name="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required errors={errors.quantity} />
        <FloatingLabelInput label="Notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} errors={errors.notes} />
        <SubmitButton label="Record Sale" loading={loading} />
      </form>
    </div>
  )
}

export default RecordSaleForm
