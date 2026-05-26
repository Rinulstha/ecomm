import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import Navbar from '../components/Navbar'

const CartPage = () => {
  const {
    cartItems,
    isLoading,
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore()
  
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

 // only show skeleton on first load when cartItems is empty
if (isLoading && cartItems.length === 0) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl h-28" />
        ))}
      </div>
    </div>
  )
}

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mt-2">
            Add some products to get started
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Browse products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your cart</h1>
            <p className="text-sm text-gray-400 mt-1">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
              >
                {/* image */}
                <div
                  className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${item.product._id}`)}
                >
                  <img
                    src={item.product.mainImage?.url}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://placehold.co/100x100?text=?'
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 truncate"
                    onClick={() => navigate(`/products/${item.product._id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    ${item.product.price} each
                  </p>

                  {/* quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-gray-800 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="ml-2 text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* item total */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-base font-bold text-gray-800 mb-4">
                Order summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>${getTotalPrice()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/products')}
                className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Continue shopping
              </button>

              <button
                className="mt-3 w-full border border-blue-600 text-blue-600 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage