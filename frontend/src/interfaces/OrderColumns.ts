export interface OrderItemColumns {
  order_item_id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
}

export interface OrderColumns {
  order_id: number
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  fulfillment_type: 'pickup' | 'delivery'
  delivery_address?: string
  delivery_landmark?: string
  status: string
  payment_method: string
  subtotal: number
  delivery_fee: number
  total_amount: number
  notes?: string
  items?: OrderItemColumns[]
  created_at: string
}

export interface ShopProduct {
  product_id: number
  product_name: string
  description?: string
  price: number
  stock_qty: number
  unit: string
  product_image?: string | null
  category?: { category_id: number; category_name: string }
}

export interface CartItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
  product_image?: string | null
  stock_qty: number
  unit: string
}
