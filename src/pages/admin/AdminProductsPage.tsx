import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import Navbar from '../../components/Navbar'

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  mainImage: { url: string }
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get('/ecommerce/products')
      setProducts(res.data.data.products)
    } catch {
      console.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeletingId(id)
    try {
      await axiosInstance.delete(`/ecommerce/products/${id}`)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch {
      alert('Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin — Products</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your store products</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Add product
          </button>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-700">No products yet</h3>
            <p className="text-gray-400 text-sm mt-1">Click "Add product" to create your first one</p>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Price</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Stock</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage?.url}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=?'
                          }}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">${product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="text-red-500 hover:underline text-sm disabled:opacity-50"
                        >
                          {deletingId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProductsPage