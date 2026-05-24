import type { OrderColumns } from '../../interfaces/OrderColumns'

const STEPS = [
  { key: 'pending', label: 'Order placed' },
  { key: 'accepted', label: 'Accepted by store' },
  { key: 'preparing', label: 'Preparing your order' },
  { key: 'fulfillment', label: 'Ready / On the way' },
  { key: 'completed', label: 'Completed' },
]

const STATUS_BANNERS: Record<
  string,
  { bg: string; text: string; message: string }
> = {
  pending: {
    bg: 'bg-amber-100 border-amber-400 text-amber-900',
    text: '⏳ Waiting',
    message: 'Your order was received. Waiting for the store to accept it.',
  },
  accepted: {
    bg: 'bg-sky-100 border-sky-400 text-sky-900',
    text: '✓ Accepted',
    message: 'The store accepted your order and will start preparing soon.',
  },
  preparing: {
    bg: 'bg-orange-100 border-orange-400 text-orange-900',
    text: '👨‍🍳 Preparing',
    message: 'Your order is being prepared right now. Please wait.',
  },
  ready_for_pickup: {
    bg: 'bg-green-200 border-green-500 text-green-900',
    text: '🎉 READY FOR PICKUP',
    message: 'Your order is READY! Please come to Aling Rosa\'s store to pick it up.',
  },
  out_for_delivery: {
    bg: 'bg-blue-200 border-blue-500 text-blue-900',
    text: '🛵 OUT FOR DELIVERY',
    message: 'Your order is on the way! Please prepare cash payment.',
  },
  completed: {
    bg: 'bg-gray-100 border-gray-400 text-gray-800',
    text: '✓ Completed',
    message: 'This order is complete. Thank you!',
  },
  cancelled: {
    bg: 'bg-red-100 border-red-400 text-red-800',
    text: '✕ Cancelled',
    message: 'This order was cancelled.',
  },
}

const statusIndex = (status: string) => {
  const map: Record<string, number> = {
    pending: 0,
    accepted: 1,
    preparing: 2,
    ready_for_pickup: 3,
    out_for_delivery: 3,
    completed: 4,
    cancelled: -1,
  }
  return map[status] ?? 0
}

const OrderStatusTimeline = ({ order }: { order: OrderColumns }) => {
  const current = statusIndex(order.status)
  const banner = STATUS_BANNERS[order.status] || STATUS_BANNERS.pending
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="space-y-5">
      {/* Always-visible current status banner */}
      <div
        className={`p-5 rounded-2xl border-2 text-center shadow-sm ${banner.bg}`}
        role="status"
        aria-live="polite"
      >
        <p className="text-xl font-bold tracking-wide">{banner.text}</p>
        <p className="mt-2 text-sm font-medium">{banner.message}</p>
      </div>

      {!isCancelled && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Order progress
          </p>
          <ol className="space-y-4">
            {STEPS.map((step, index) => {
              const done = index <= current
              const active = index === current
              let label = step.label
              if (step.key === 'fulfillment' && order.fulfillment_type === 'pickup') {
                label = 'Ready for pickup'
              }
              if (step.key === 'fulfillment' && order.fulfillment_type === 'delivery') {
                label = 'Out for delivery'
              }

              return (
                <li key={step.key} className="flex items-center gap-4">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      done
                        ? active
                          ? 'bg-orange-500 text-white ring-4 ring-orange-300 scale-110'
                          : 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {done && !active ? '✓' : index + 1}
                  </span>
                  <span
                    className={`text-base ${
                      active
                        ? 'font-bold text-orange-700'
                        : done
                          ? 'text-gray-800'
                          : 'text-gray-400'
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}

export default OrderStatusTimeline
