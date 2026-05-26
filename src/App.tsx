import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminProductFormPage from './pages/admin/AdminProductFormPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './pages/CartPage'
import AdminRoute from './components/AdminRoute'
function App() {
  const { getCurrentUser, accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) getCurrentUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email/:verificationToken" element={<VerifyEmailPage />} />

        {/* user routes */}
        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/products/:productId" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  }
/>

        {/* admin routes */}
        <Route
  path="/admin/categories"
  element={
    <AdminRoute>
      <AdminCategoriesPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProductsPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products/create"
  element={
    <AdminRoute>
      <AdminProductFormPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products/edit/:productId"
  element={
    <AdminRoute>
      <AdminProductFormPage />
    </AdminRoute>
  }
/>

        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App