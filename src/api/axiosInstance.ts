import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.freeapi.app/api/v1',
})

// attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // skip retry for auth endpoints — avoids infinite loop
    const skipUrls = [
      '/users/login',
      '/users/register',
      '/users/logout',
      '/users/refresh-token',
    ]
    const isAuthEndpoint = skipUrls.some((url) =>
      originalRequest.url?.includes(url)
    )

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')

        // if no refresh token, just logout cleanly
        if (!refreshToken) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const res = await axios.post(
          'https://api.freeapi.app/api/v1/users/refresh-token',
          { refreshToken }
        )
        const newAccessToken = res.data.data.accessToken
        localStorage.setItem('accessToken', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch {
        // refresh failed — clear everything and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance