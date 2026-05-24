import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/shop" className="text-orange-600 hover:underline font-medium">
          Browse menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white rounded-xl border divide-y">
        {items.map((item) => (
          <div key={item.product_id} className="p-4 flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {item.product_image ? (
                <img src={item.product_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.product_name}</h3>
              <p className="text-orange-600 font-semibold">₱{Number(item.price).toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  className="w-8 h-8 border rounded"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  className="w-8 h-8 border rounded"
                  disabled={item.quantity >= item.stock_qty}
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-red-500 text-sm ml-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-xl border p-4 flex justify-between items-center">
        <span className="font-semibold">Subtotal</span>
        <span className="text-xl font-bold text-orange-600">₱{subtotal.toFixed(2)}</span>
      </div>
      <Link
        to="/shop/checkout"
        className="mt-4 block w-full text-center bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600"
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}

export default CartPage
