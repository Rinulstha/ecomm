import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import Navbar from '../../components/Navbar'

interface Category {
  _id: string
  name: string
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get('/ecommerce/categories')
      setCategories(res.data.data.categories)
    } catch {
      setError('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    setCreating(true)
    setError(null)
    try {
      await axiosInstance.post('/ecommerce/categories', { name: newCategory })
      setNewCategory('')
      fetchCategories()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    setDeletingId(id)
    try {
      await axiosInstance.delete(`/ecommerce/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c._id !== id))
    } catch {
      alert('Failed to delete category')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin — Categories
        </h1>

        {/* create form */}
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New category name
          </label>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Electronics"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>

        {/* categories list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading && (
            <div className="p-6 space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-200 h-8 rounded" />
              ))}
            </div>
          )}

          {!isLoading && categories.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No categories yet. Create one above.
            </div>
          )}

          {!isLoading && categories.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-sm text-gray-800 font-medium">
                    {cat.name}
                  </span>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    disabled={deletingId === cat._id}
                    className="text-red-500 hover:underline text-sm disabled:opacity-50"
                  >
                    {deletingId === cat._id ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCategoriesPage