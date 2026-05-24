import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const AxiosInstance = axios.create({ baseURL })

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isPublicShop =
        error.config?.url?.includes('/shop/') ||
        error.config?.url?.includes('/auth/login')

      if (!isPublicShop) {
        localStorage.removeItem('token')
        if (!window.location.pathname.startsWith('/shop') && window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }
    }

    if (error.response?.status !== 422) {
      console.error('API error:', error.response?.status, error.config?.url)
    }

    return Promise.reject(error)
  },
)

export default AxiosInstance
