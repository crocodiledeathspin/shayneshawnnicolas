import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const CustomerLayout = () => {
  const { itemCount } = useCart()

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/shop" className="font-bold text-orange-600 text-lg">
            Jojo Store and Snackhouse
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/shop" className="text-gray-700 hover:text-orange-600">
              Menu
            </Link>
            <Link to="/shop/track" className="text-gray-700 hover:text-orange-600">
              Track / My Orders
            </Link>
            <Link
              to="/shop/cart"
              className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600"
            >
              Cart ({itemCount})
            </Link>
            <Link to="/" className="text-gray-500 hover:text-orange-600 text-xs">
              Staff Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default CustomerLayout
