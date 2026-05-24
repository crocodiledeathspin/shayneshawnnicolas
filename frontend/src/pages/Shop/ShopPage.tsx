import { useEffect, useState } from 'react'
import ShopService from '../../services/ShopService'
import { useCart } from '../../contexts/CartContext'
import type { ShopProduct } from '../../interfaces/OrderColumns'
import Spinner from '../../components/Spinner/Spinner'

const ShopPage = () => {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [deliveryArea, setDeliveryArea] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    document.title = "Order Online - Aling Rosa's"
    ShopService.loadShopCategories().then((res) => setCategories(res.data.categories || []))
    loadProducts()
  }, [])

  const loadProducts = (categoryId?: number | null) => {
    setLoading(true)
    ShopService.loadShopProducts(categoryId || undefined)
      .then((res) => {
        setProducts(res.data.products || [])
        setDeliveryArea(res.data.delivery_area || '')
      })
      .finally(() => setLoading(false))
  }

  const filterCategory = (id: number | null) => {
    setActiveCategory(id)
    loadProducts(id)
  }

  return (
    <div>
      <div className="bg-white rounded-xl p-6 mb-6 border border-orange-100">
        <h1 className="text-2xl font-bold text-gray-800">Order Street Food, Shakes &amp; More</h1>
        <p className="text-gray-600 mt-1">
          Pickup or delivery in {deliveryArea || 'Roxas City'}. No account needed — just your name and phone.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => filterCategory(null)}
          className={`px-4 py-2 rounded-full text-sm ${activeCategory === null ? 'bg-orange-500 text-white' : 'bg-white border'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.category_id}
            onClick={() => filterCategory(c.category_id)}
            className={`px-4 py-2 rounded-full text-sm ${activeCategory === c.category_id ? 'bg-orange-500 text-white' : 'bg-white border'}`}
          >
            {c.category_name}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.product_id} className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {p.product_image ? (
                  <img src={p.product_image} alt={p.product_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🛒</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-orange-600">{p.category?.category_name}</p>
                <h3 className="font-semibold text-gray-800">{p.product_name}</h3>
                <p className="text-lg font-bold text-orange-600 mt-1">₱{Number(p.price).toFixed(2)}</p>
                <p className="text-xs text-gray-500">{p.stock_qty} {p.unit} available</p>
                <button
                  onClick={() =>
                    addItem({
                      product_id: p.product_id,
                      product_name: p.product_name,
                      price: Number(p.price),
                      product_image: p.product_image,
                      stock_qty: p.stock_qty,
                      unit: p.unit,
                    })
                  }
                  className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 text-sm font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500 py-12">No products available right now.</p>
      )}
    </div>
  )
}

export default ShopPage
