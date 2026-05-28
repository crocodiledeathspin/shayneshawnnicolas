const HISTORY_KEY = 'jojo_store_order_history'
const MAX_ORDERS = 20

export interface SavedOrder {
  order_number: string
  customer_phone: string
  customer_name: string
  fulfillment_type: 'pickup' | 'delivery'
  total_amount: number
  placed_at: string
}

export const saveOrderToHistory = (order: SavedOrder) => {
  try {
    const existing = getOrderHistory()
    const filtered = existing.filter(
      (o) => o.order_number !== order.order_number,
    )
    const updated = [order, ...filtered].slice(0, MAX_ORDERS)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage errors
  }
}

export const getOrderHistory = (): SavedOrder[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const removeOrderFromHistory = (orderNumber: string) => {
  const updated = getOrderHistory().filter((o) => o.order_number !== orderNumber)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}
