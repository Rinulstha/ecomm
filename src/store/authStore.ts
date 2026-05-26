import { create } from 'zustand'
import axiosInstance from '../api/axiosInstance'

interface User {
  _id: string
  username: string
  email: string
  role: string
  isEmailVerified: boolean
  avatar: {
    url: string
    localPath: string
  }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
register: (username: string, email: string, password: string, role: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isLoading: false,
  error: null,

  



register: async (username, email, password, role) => {
  set({ isLoading: true, error: null })
  try {
    await axiosInstance.post('/users/register', {
      username,
      email,
      password,
      role,
    })
    set({ isLoading: false })
    return true
  } catch (err: any) {
    set({
      error: err.response?.data?.message || 'Registration failed',
      isLoading: false,
    })
    return false
  }
},

login: async (email, password) => {
  set({ isLoading: true, error: null })
  try {
    const res = await axiosInstance.post('/users/login', {
      email,
      password,
    })
    const { accessToken, refreshToken, user } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ user, accessToken, isLoading: false })
    return true
  } catch (err: any) {
    const message =
      err.response?.data?.message || 'Login failed. Check your email and password.'
    set({ error: message, isLoading: false })
    return false
  }
},

logout: async () => {
  try {
    await axiosInstance.post('/users/logout')
  } finally {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')  // clear refresh token too
    set({ user: null, accessToken: null })
  }
},
  getCurrentUser: async () => {
    try {
      const res = await axiosInstance.get('/users/current-user')
      set({ user: res.data.data })
    } catch {
      localStorage.removeItem('accessToken')
      set({ user: null, accessToken: null })
    }
  },
}))

export default useAuthStore