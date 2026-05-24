import { useEffect, useState } from 'react'
import OrderService from '../../services/OrderService'
import type { OrderColumns } from '../../interfaces/OrderColumns'
import Spinner from '../../components/Spinner/Spinner'
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { useToastMessage } from '../../hooks/useToastMessage'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
  pending: [{ value: 'accepted', label: 'Accept' }, { value: 'cancelled', label: 'Cancel' }],
  accepted: [{ value: 'preparing', label: 'Start Preparing' }, { value: 'cancelled', label: 'Cancel' }],
  preparing: [
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'cancelled', label: 'Cancel' },
  ],
  ready_for_pickup: [{ value: 'completed', label: 'Mark Completed' }],
  out_for_delivery: [{ value: 'completed', label: 'Mark Delivered' }],
}

const OrdersMainPage = () => {
  const [orders, setOrders] = useState<OrderColumns[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [search, setSearch] = useState('')
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()

  const loadOrders = () => {
    setLoading(true)
    OrderService.loadOrders(1, statusFilter, search)
      .then((res) => setOrders(res.data.orders || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    document.title = 'Orders'
    loadOrders()
  }, [statusFilter])

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const res = await OrderService.updateOrderStatus(orderId, status)
      showToastMessage(res.data.message)
      loadOrders()
    } catch {
      showToastMessage('Failed to update status', true)
    }
  }

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search order #, name, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
        />
        <button onClick={loadOrders} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
          Search
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-white border rounded-xl p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <span className="font-bold text-orange-600">{order.order_number}</span>
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded capitalize">{order.status.replace(/_/g, ' ')}</span>
                  <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded capitalize">{order.fulfillment_type}</span>
                </div>
                <span className="font-bold">₱{Number(order.total_amount).toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {order.customer_name} · {order.customer_phone}
                {order.fulfillment_type === 'delivery' && order.delivery_address && (
                  <span> · {order.delivery_address}</span>
                )}
              </p>
              <ul className="text-sm mt-2 text-gray-700">
                {order.items?.map((i) => (
                  <li key={i.order_item_id}>• {i.product_name} × {i.quantity}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-3">
                {(NEXT_STATUS[order.status] || []).map((action) => (
                  <button
                    key={action.value}
                    onClick={() => updateStatus(order.order_id, action.value)}
                    className={`text-sm px-3 py-1.5 rounded-lg ${
                      action.value === 'cancelled'
                        ? 'border border-red-300 text-red-600 hover:bg-red-50'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default OrdersMainPage
