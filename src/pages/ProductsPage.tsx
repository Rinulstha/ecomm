import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import useCartStore from '../store/cartStore'
import Navbar from '../components/Navbar'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  mainImage: {
    url: string
  }
  category: string  // just an ID string, not an object
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [addingId, setAddingId] = useState<string | null>(null)

  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  const fetchProducts = async (pageNum: number, query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get('/ecommerce/products', {
        params: {
          page: pageNum,
          limit: 12,
          q: query || undefined,
        },
      })
      // correct path: res.data.data.products
      setProducts(res.data.data.products)
      setHasNextPage(res.data.data.hasNextPage)
      setTotalPages(res.data.data.totalPages)
    } catch {
      setError('Failed to load products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(page, search)
  }, [page])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      fetchProducts(1, search)
    }, 500)
    return () => clearTimeout(timeout)
  }, [search])

  const handleAddToCart = async (product: Product) => {
    setAddingId(product._id)
    await addToCart(product._id)
    setAddingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-sm text-gray-400 mt-1">
              Browse and add items to your cart
            </p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="bg-gray-200 h-48 w-full" />
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                  <div className="bg-gray-200 h-4 rounded w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* products grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
              >
                {/* image */}
                <div
                  className="h-48 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <img
                    src={product.mainImage?.url}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/640x480?text=No+Image'
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* info */}
                <div className="p-4">
                  <h3
                    className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 line-clamp-2"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <span
                      className={`text-xs ${
                        product.stock > 0 ? 'text-green-500' : 'text-red-400'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || addingId === product._id}
                    className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingId === product._id ? 'Adding...' : 'Add to cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* empty state */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </div>
        )}

        {/* pagination */}
        {!isLoading && products.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage