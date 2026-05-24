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

function getNextActions(order: OrderColumns): { value: string; label: string; destructive?: boolean }[] {
  const { status, fulfillment_type } = order

  switch (status) {
    case 'pending':
      return [
        { value: 'accepted', label: 'Accept Order' },
        { value: 'cancelled', label: 'Cancel Order', destructive: true },
      ]
    case 'accepted':
      return [
        { value: 'preparing', label: 'Start Preparing' },
        { value: 'cancelled', label: 'Cancel Order', destructive: true },
      ]
    case 'preparing':
      if (fulfillment_type === 'pickup') {
        return [
          { value: 'ready_for_pickup', label: 'Ready for Pickup' },
          { value: 'cancelled', label: 'Cancel Order', destructive: true },
        ]
      }
      return [
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'cancelled', label: 'Cancel Order', destructive: true },
      ]
    case 'ready_for_pickup':
      return [{ value: 'completed', label: 'Picked Up — Complete' }]
    case 'out_for_delivery':
      return [{ value: 'completed', label: 'Delivered — Complete' }]
    default:
      return []
  }
}

const OrdersMainPage = () => {
  const [orders, setOrders] = useState<OrderColumns[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const { message, isVisible, isFailed, showToastMessage, closeToastMessage } = useToastMessage()

  const loadOrders = (pageNum = 1, append = false) => {
    setLoading(true)
    OrderService.loadOrders(pageNum, statusFilter, search)
      .then((res) => {
        const list = res.data.orders || []
        setOrders((prev) => (append ? [...prev, ...list] : list))
        setHasMore(res.data.has_more_pages)
        setPage(res.data.current_page)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    document.title = 'Orders'
    setPage(1)
    loadOrders(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const updateStatus = async (orderId: number, status: string, label: string) => {
    const confirmMsg =
      status === 'cancelled'
        ? 'Cancel this order? Stock will be restored to inventory.'
        : `Mark order as "${label}"?`

    if (!window.confirm(confirmMsg)) return

    try {
      const res = await OrderService.updateOrderStatus(orderId, status)
      showToastMessage(res.data.message)
      loadOrders(1)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      showToastMessage(e.response?.data?.message || 'Failed to update status', true)
    }
  }

  return (
    <>
      <ToastMessage message={message} isVisible={isVisible} isFailed={isFailed} onClose={closeToastMessage} />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Orders</h1>
      <p className="text-sm text-gray-500 mb-6">
        Update status so customers see progress on Track Order (ready for pickup / out for delivery).
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search order #, name, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
        />
        <button onClick={() => loadOrders(1)} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
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

      {loading && !orders.length ? (
        <Spinner size="lg" />
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const actions = getNextActions(order)
            return (
              <div key={order.order_id} className="bg-white border rounded-xl p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <span className="font-bold text-orange-600">{order.order_number}</span>
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded capitalize">
                      {order.fulfillment_type}
                    </span>
                  </div>
                  <span className="font-bold">₱{Number(order.total_amount).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {order.customer_name} · {order.customer_phone}
                  {order.fulfillment_type === 'delivery' && order.delivery_address && (
                    <span className="block mt-1">📍 {order.delivery_address}</span>
                  )}
                </p>
                <ul className="text-sm mt-2 text-gray-700">
                  {order.items?.map((i) => (
                    <li key={i.order_item_id}>• {i.product_name} × {i.quantity}</li>
                  ))}
                </ul>
                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {actions.map((action) => (
                      <button
                        key={action.value}
                        onClick={() => updateStatus(order.order_id, action.value, action.label)}
                        className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                          action.destructive
                            ? 'border border-red-300 text-red-600 hover:bg-red-50'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {hasMore && (
            <button
              onClick={() => loadOrders(page + 1, true)}
              className="w-full py-2 text-orange-600 hover:underline"
              disabled={loading}
            >
              Load more orders
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default OrdersMainPage
