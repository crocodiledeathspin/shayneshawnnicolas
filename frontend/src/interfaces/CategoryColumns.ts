export interface CategoryColumns {
  category_id: number
  category_name: string
  description?: string
}

export interface CategoryFieldErrors {
  category_name?: string[]
  description?: string[]
}
