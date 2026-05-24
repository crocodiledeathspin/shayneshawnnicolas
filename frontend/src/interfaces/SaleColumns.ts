export interface SaleColumns {
  sale_id: number
  product_id: number
  user_id: number
  quantity: number
  unit_price: number
  total_amount: number
  sale_date: string
  notes?: string
  product?: {
    product_name: string
    category?: { category_name: string }
  }
  user?: { full_name: string }
}

export interface SaleFieldErrors {
  product?: string[]
  quantity?: string[]
  notes?: string[]
}
