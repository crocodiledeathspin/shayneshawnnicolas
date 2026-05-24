import { useState, type FC, type FormEvent } from 'react'
import Modal from '../../../components/Modal'
import SubmitButton from '../../../components/Button/SubmitButton'
import ProductService from '../../../services/ProductService'
import type { ProductColumns } from '../../../interfaces/ProductColumns'

interface Props {
  isOpen: boolean
  product: ProductColumns | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

const DeleteProductModal: FC<Props> = ({ isOpen, product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    try {
      const res = await ProductService.destroyProduct(product.product_id)
      onSuccess(res.data.message)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Product">
      <p className="mb-4">Delete <strong>{product?.product_name}</strong>?</p>
      <form onSubmit={handleDelete}>
        <SubmitButton label="Confirm Delete" loading={loading} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl" />
      </form>
    </Modal>
  )
}

export default DeleteProductModal
