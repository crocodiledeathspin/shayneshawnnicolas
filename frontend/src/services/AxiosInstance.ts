import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const AxiosInstance = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
})

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    // Let the browser set multipart boundary; a bare Content-Type breaks file uploads
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isPublicShop = url.includes('/shop/') || url.includes('/auth/login')
      const isAuthSession = url.includes('/auth/logout') || url.includes('/auth/me')

      if (!isPublicShop && !isAuthSession) {
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
