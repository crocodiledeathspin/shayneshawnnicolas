import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { saveOrderToHistory } from '../../utils/orderHistory'

const OrderSuccessPage = () => {
  const { orderNumber } = useParams()
  const location = useLocation()
  const state = location.state as {
    phone?: string
    customer_name?: string
    fulfillment_type?: 'pickup' | 'delivery'
    total_amount?: number
  } | null
  const phone = state?.phone || ''

  useEffect(() => {
    if (orderNumber && phone && state?.customer_name) {
      saveOrderToHistory({
        order_number: orderNumber,
        customer_phone: phone,
        customer_name: state.customer_name,
        fulfillment_type: state.fulfillment_type || 'pickup',
        total_amount: state.total_amount || 0,
        placed_at: new Date().toISOString(),
      })
    }
  }, [orderNumber, phone, state])

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-800">Order Placed!</h1>
      <p className="text-gray-600 mt-2">Thank you for ordering from Aling Rosa&apos;s.</p>

      <div className="bg-white border rounded-xl p-6 mt-6 text-left">
        <p className="text-sm text-gray-500 text-center">Order Number</p>
        <p className="text-2xl font-bold text-orange-600 text-center">{orderNumber}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p className="font-medium text-gray-800">How to know when it&apos;s ready:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>
              Open <strong>Track Order</strong> — saved on this device under &quot;Your orders&quot;
            </li>
            <li>Status updates when staff accepts and prepares your order</li>
            <li>
              You&apos;ll see a green alert when it&apos;s <strong>Ready for pickup</strong> or{' '}
              <strong>Out for delivery</strong>
            </li>
            {state?.fulfillment_type === 'pickup' && (
              <li>Come to the store when you see &quot;Ready for pickup&quot;</li>
            )}
          </ul>
        </div>
      </div>

      <Link
        to="/shop/track"
        state={{ orderNumber, phone }}
        className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
      >
        Track My Order
      </Link>
      <Link to="/shop" className="block mt-4 text-orange-600 hover:underline">
        Order more
      </Link>
    </div>
  )
}

export default OrderSuccessPage
