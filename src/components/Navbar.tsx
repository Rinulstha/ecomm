import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const { getTotalItems } = useCartStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* logo — goes to different home based on role */}
      <Link
        to={isAdmin ? '/admin/products' : '/products'}
        className="text-xl font-bold text-blue-600"
      >
        ShopApp {isAdmin && <span className="text-xs text-gray-400 font-normal ml-1">Admin</span>}
      </Link>

      <div className="flex items-center gap-6">
        {/* user links */}
        {!isAdmin && (
          <>
            <Link
              to="/products"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="relative text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </>
        )}

        {/* admin links */}
        {isAdmin && (
          <>
            <Link
              to="/admin/products"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Products
            </Link>
            <Link
              to="/admin/categories"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Categories
            </Link>
          </>
        )}

        {/* username */}
        {user && (
          <span className="text-sm text-gray-400">
            Hi, {user.username}
          </span>
        )}

        {/* logout */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar