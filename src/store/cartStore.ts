import { create } from 'zustand'
import axiosInstance from '../api/axiosInstance'

interface CartProduct {
  _id: string
  name: string
  price: number
  mainImage: {
    url: string
  }
}

interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartState {
  cartItems: CartItem[]
  coupon: string | null
  isLoading: boolean
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void> 
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => string
}

const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  coupon: null,
  isLoading: false,

  fetchCart: async () => {
  set({ isLoading: true })
  try {
    const res = await axiosInstance.get('/ecommerce/cart')
    const items = res.data.data?.items || []
    set({ cartItems: items, isLoading: false })
  } catch {
    set({ isLoading: false })
  }
},

  addToCart: async (productId, quantity = 1) => {
    try {
      await axiosInstance.post(`/ecommerce/cart/item/${productId}`, { quantity })
      await get().fetchCart()
    } catch (err) {
      console.error('Failed to add to cart', err)
    }
  },

 updateQuantity: async (productId: string, quantity: number) => {
  if (quantity < 1) return

  // update UI instantly without loading flash
  set({
    cartItems: get().cartItems.map((item) =>
      item.product._id === productId ? { ...item, quantity } : item
    ),
  })

  try {
    await axiosInstance.post(`/ecommerce/cart/item/${productId}`, { quantity })
  } catch (err) {
    // if API fails, re-fetch to get correct state back
    console.error('Failed to update quantity', err)
    await get().fetchCart()
  }
},

removeFromCart: async (productId: string) => {
  // remove from UI instantly
  set({
    cartItems: get().cartItems.filter((item) => item.product._id !== productId),
  })

  try {
    await axiosInstance.delete(`/ecommerce/cart/item/${productId}`)
  } catch (err) {
    console.error('Failed to remove from cart', err)
    await get().fetchCart()
  }
},

clearCart: async () => {
  // clear UI instantly
  set({ cartItems: [] })

  try {
    await axiosInstance.delete('/ecommerce/cart/clear')
  } catch (err) {
    console.error('Failed to clear cart', err)
    await get().fetchCart()
  }
},

  getTotalItems: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: () => {
    return get().cartItems
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2)
  },
}))

export default useCartStore