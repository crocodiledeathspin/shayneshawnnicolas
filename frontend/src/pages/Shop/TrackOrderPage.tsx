import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import ShopService from '../../services/ShopService'
import type { OrderColumns } from '../../interfaces/OrderColumns'
import SubmitButton from '../../components/Button/SubmitButton'
import OrderStatusTimeline from '../../components/Shop/OrderStatusTimeline'
import { getOrderHistory, type SavedOrder } from '../../utils/orderHistory'
import { normalizePhone } from '../../utils/phone'

const TrackOrderPage = () => {
  const location = useLocation()
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<OrderColumns | null>(null)
  const [history, setHistory] = useState<SavedOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchOrder = useCallback(async (num: string, ph: string, silent = false) => {
    if (!num?.trim() || !ph?.trim()) return
    if (!silent) setLoading(true)
    setError('')
    try {
      const res = await ShopService.trackOrder(num.trim(), normalizePhone(ph))
      setOrder(res.data.order)
      setLastUpdated(new Date())
    } catch {
      if (!silent) {
        setOrder(null)
        setError('Order not found. Use the same phone number you used when ordering.')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Auto-load: from success page state, URL ?order=&phone=, or single saved order
  useEffect(() => {
    setHistory(getOrderHistory())

    const state = location.state as { orderNumber?: string; phone?: string } | null
    const params = new URLSearchParams(location.search)
    const saved = getOrderHistory()

    const num = state?.orderNumber || params.get('order') || ''
    const ph = state?.phone || params.get('phone') || ''

    if (num) setOrderNumber(num)
    if (ph) setPhone(ph)

    if (num && ph) {
      fetchOrder(num, ph)
    } else if (saved.length === 1) {
      setOrderNumber(saved[0].order_number)
      setPhone(saved[0].customer_phone)
      fetchOrder(saved[0].order_number, saved[0].customer_phone)
    }
  }, [location.state, location.search, fetchOrder])

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault()
    await fetchOrder(orderNumber, phone)
  }

  const trackFromHistory = (saved: SavedOrder) => {
    setOrderNumber(saved.order_number)
    setPhone(saved.customer_phone)
    fetchOrder(saved.order_number, saved.customer_phone)
  }

  useEffect(() => {
    if (!order || !autoRefresh) return
    if (['completed', 'cancelled'].includes(order.status)) return

    const interval = setInterval(() => {
      fetchOrder(order.order_number, order.customer_phone, true)
    }, 20000)

    return () => clearInterval(interval)
  }, [order, autoRefresh, fetchOrder])

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
      <p className="text-gray-600 text-sm mb-6">
        Status updates appear below after you track. Page auto-refreshes every 20 seconds.
      </p>

      {history.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-orange-200 p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">📋 Your orders on this device</h2>
          <p className="text-xs text-gray-500 mb-3">Tap an order to see live status</p>
          <ul className="space-y-2">
            {history.map((saved) => (
              <li key={saved.order_number}>
                <button
                  type="button"
                  onClick={() => trackFromHistory(saved)}
                  className="w-full text-left p-3 rounded-lg border-2 hover:bg-orange-50 hover:border-orange-400 transition"
                >
                  <span className="font-bold text-orange-600">{saved.order_number}</span>
                  <span className="text-sm text-gray-600 ml-2 capitalize">({saved.fulfillment_type})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleTrack} className="bg-white rounded-xl border p-6 space-y-4 mb-6">
        <input
          className="w-full border-2 rounded-lg px-4 py-3"
          placeholder="Order number (e.g. JS-20260524-ABC12)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
        />
        <input
          className="w-full border-2 rounded-lg px-4 py-3"
          placeholder="Phone used when ordering"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <SubmitButton label="Track Order" loading={loading} />
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
          {error}
        </div>
      )}

      {loading && !order && (
        <div className="text-center py-8 text-gray-500">Loading order status...</div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pb-4 border-b">
            <div>
              <p className="text-xs text-gray-500">Order</p>
              <p className="font-bold text-orange-600 text-xl">{order.order_number}</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                type="button"
                onClick={() => fetchOrder(order.order_number, order.customer_phone)}
                className="text-sm text-orange-600 hover:underline font-medium"
              >
                Refresh now
              </button>
              <label className="text-xs flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto (20s)
              </label>
            </div>
          </div>

          <OrderStatusTimeline order={order} />

          <div className="mt-6 pt-4 border-t">
            <p className="font-semibold">Total: ₱{Number(order.total_amount).toFixed(2)} (Cash)</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {order.items?.map((i) => (
                <li key={i.order_item_id}>
                  • {i.product_name} × {i.quantity} — ₱{Number(i.line_total).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!order && !loading && !error && (
        <p className="text-center text-gray-400 text-sm">
          Enter your order number and phone above, or tap a saved order.
        </p>
      )}
    </div>
  )
}

export default TrackOrderPage
