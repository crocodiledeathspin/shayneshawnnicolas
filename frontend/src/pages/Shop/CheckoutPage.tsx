import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import ShopService from '../../services/ShopService'
import FloatingLabelInput from '../../components/Inputs/FloatingLabelInput'
import SubmitButton from '../../components/Button/SubmitButton'
import { normalizePhone } from '../../utils/phone'

const CheckoutPage = () => {
  const { items, subtotal, clearCart, itemCount } = useCart()
  const navigate = useNavigate()
  const [deliveryFee, setDeliveryFee] = useState(25)
  const [deliveryArea, setDeliveryArea] = useState('')
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_landmark: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (itemCount === 0) navigate('/shop/cart')
    ShopService.loadShopProducts().then((res) => {
      setDeliveryFee(Number(res.data.delivery_fee) || 25)
      setDeliveryArea(res.data.delivery_area || 'Roxas City')
    })
  }, [itemCount, navigate])

  const total = subtotal + (fulfillment === 'delivery' ? deliveryFee : 0)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await ShopService.storeOrder({
        ...form,
        customer_phone: normalizePhone(form.customer_phone),
        fulfillment_type: fulfillment,
        delivery_address: fulfillment === 'delivery' ? form.delivery_address : null,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      })
      clearCart()
      const placed = res.data.order
      navigate(`/shop/success/${placed.order_number}`, {
        state: {
          phone: form.customer_phone,
          customer_name: form.customer_name,
          fulfillment_type: fulfillment,
          total_amount: placed.total_amount,
        },
      })
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e.response?.data?.message || 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <p className="text-sm text-gray-600 mb-4">Cash payment on pickup or delivery. No login required.</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setFulfillment('pickup')}
          className={`p-4 rounded-xl border-2 text-left ${fulfillment === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
        >
          <span className="font-semibold">Pickup</span>
          <p className="text-xs text-gray-500 mt-1">Pick up at the store</p>
        </button>
        <button
          type="button"
          onClick={() => setFulfillment('delivery')}
          className={`p-4 rounded-xl border-2 text-left ${fulfillment === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
        >
          <span className="font-semibold">Delivery</span>
          <p className="text-xs text-gray-500 mt-1">₱{deliveryFee} fee · {deliveryArea}</p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        <FloatingLabelInput label="Your Name" name="customer_name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
        <FloatingLabelInput label="Mobile Number" name="customer_phone" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} required />
        <FloatingLabelInput label="Email (optional)" name="customer_email" type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />

        {fulfillment === 'delivery' && (
          <>
            <FloatingLabelInput label="Delivery Address" name="delivery_address" value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} required />
            <FloatingLabelInput label="Landmark (optional)" name="delivery_landmark" value={form.delivery_landmark} onChange={(e) => setForm({ ...form, delivery_landmark: e.target.value })} />
          </>
        )}

        <FloatingLabelInput label="Notes (optional)" name="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

        <div className="border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span></div>
          {fulfillment === 'delivery' && (
            <div className="flex justify-between"><span>Delivery fee</span><span>₱{deliveryFee.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between font-bold text-lg text-orange-600">
            <span>Total</span><span>₱{total.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <SubmitButton label="Place Order" loading={loading} loadingLabel="Placing order..." />
      </form>
    </div>
  )
}

export default CheckoutPage
