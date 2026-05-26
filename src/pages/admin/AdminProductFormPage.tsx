import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import Navbar from '../../components/Navbar'

interface Category {
  _id: string
  name: string
}

const AdminProductFormPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const isEditing = Boolean(productId)
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  })
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')

  // fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/ecommerce/categories')
        setCategories(res.data.data.categories)
      } catch {
        console.error('Failed to fetch categories')
      }
    }
    fetchCategories()
  }, [])

  // if editing, fetch existing product data
  useEffect(() => {
    if (!isEditing) return
    const fetchProduct = async () => {
      setIsFetching(true)
      try {
        const res = await axiosInstance.get(`/ecommerce/products/${productId}`)
        const p = res.data.data
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          stock: String(p.stock),
          category: p.category,
        })
        setMainImagePreview(p.mainImage?.url)
      } catch {
        setError('Failed to load product')
      } finally {
        setIsFetching(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // API expects multipart/form-data because of image upload
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('stock', form.stock)
      formData.append('category', form.category)
      if (mainImage) {
        formData.append('mainImage', mainImage)
      }

      if (isEditing) {
        await axiosInstance.patch(`/ecommerce/products/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await axiosInstance.post('/ecommerce/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      setSuccess(true)
      setTimeout(() => navigate('/admin/products'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse space-y-4">
          <div className="bg-gray-200 h-6 rounded w-1/3" />
          <div className="bg-gray-200 h-12 rounded" />
          <div className="bg-gray-200 h-24 rounded" />
          <div className="bg-gray-200 h-12 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-sm text-gray-400 hover:text-blue-600 transition mb-6"
        >
          ← Back to products
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit product' : 'Add new product'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-6">
            {isEditing ? 'Product updated!' : 'Product created!'} Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          {/* name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Wireless Headphones"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe your product..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* price and stock side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            {categories.length === 0 ? (
              <div className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
                No categories found.{' '}
                <button
                  type="button"
                  onClick={() => navigate('/admin/categories')}
                  className="underline font-medium"
                >
                  Create a category first
                </button>
              </div>
            ) : (
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* main image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main image {isEditing && '(leave empty to keep current)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {mainImagePreview && (
              <img
                src={mainImagePreview}
                alt="Preview"
                className="mt-3 h-40 w-full object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || categories.length === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isEditing ? 'Updating...' : 'Creating...'
              : isEditing ? 'Update product' : 'Create product'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminProductFormPage