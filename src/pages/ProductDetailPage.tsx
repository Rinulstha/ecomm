import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import useCartStore from '../store/cartStore'
import Navbar from '../components/Navbar'

interface SubImage {
  _id: string
  url: string
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  mainImage: {
    url: string
  }
  subImages: SubImage[]
  category: string
}

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addToCart } = useCartStore()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const res = await axiosInstance.get(`/ecommerce/products/${productId}`)
        const data = res.data.data
        setProduct(data)
        setSelectedImage(data.mainImage?.url)
      } catch {
        setError('Failed to load product details.')
      } finally {
        setIsLoading(false)
      }
    }
    if (productId) fetchProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    await addToCart(product._id, quantity)
    setAdding(false)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-200 rounded-xl h-96" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-6 rounded w-3/4" />
              <div className="bg-gray-200 h-4 rounded w-1/2" />
              <div className="bg-gray-200 h-4 rounded w-full" />
              <div className="bg-gray-200 h-4 rounded w-full" />
              <div className="bg-gray-200 h-8 rounded w-1/4 mt-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-700">Product not found</h3>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 text-blue-600 text-sm hover:underline"
          >
            Back to products
          </button>
        </div>
      </div>
    )
  }

  const allImages = [product.mainImage, ...product.subImages].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* back button */}
        <button
          onClick={() => navigate('/products')}
          className="text-sm text-gray-400 hover:text-blue-600 transition mb-6 flex items-center gap-1"
        >
          ← Back to products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* left — images */}
          <div>
            {/* main image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm h-80">
              <img
                src={selectedImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/640x480?text=No+Image'
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* sub images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img.url)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === img.url
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} view ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100?text=?'
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* right — details */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6">
              <span className="text-3xl font-bold text-gray-800">
                ${product.price}
              </span>
            </div>

            {/* stock status */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  ✓ In stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  Out of stock
                </span>
              )}
            </div>

            {/* quantity selector */}
            {product.stock > 0 && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <span className="text-gray-800 font-medium w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* total price */}
            {product.stock > 0 && quantity > 1 && (
              <p className="text-sm text-gray-400 mt-2">
                Total: ${(product.price * quantity).toFixed(2)}
              </p>
            )}

            {/* add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className={`mt-8 py-3 rounded-xl text-sm font-medium transition ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {adding
                ? 'Adding to cart...'
                : addedToCart
                ? '✓ Added to cart!'
                : 'Add to cart'}
            </button>

            {/* go to cart */}
            {addedToCart && (
              <button
                onClick={() => navigate('/cart')}
                className="mt-3 py-3 rounded-xl text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Go to cart →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage