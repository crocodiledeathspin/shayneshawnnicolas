export interface ProductColumns {
  product_id: number
  category_id: number
  product_name: string
  description?: string
  price: number
  stock_qty: number
  unit: string
  reorder_level: number
  product_image?: string | null
  is_low_stock?: boolean
  category?: { category_id: number; category_name: string }
}

export interface ProductFieldErrors {
  product_name?: string[]
  category?: string[]
  price?: string[]
  stock_qty?: string[]
  unit?: string[]
  reorder_level?: string[]
  add_product_image?: string[]
  edit_product_image?: string[]
}
