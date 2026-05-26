import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, user } = useAuthStore()

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  if (user && user.role !== 'ADMIN') {
    return <Navigate to="/products" replace />
  }

  return <>{children}</>
}

export default AdminRoute