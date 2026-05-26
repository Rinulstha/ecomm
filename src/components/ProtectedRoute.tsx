import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuthStore()

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute