import AxiosInstance from './AxiosInstance'

const AuthService = {
  login: (credentials: { username: string; password: string }) =>
    AxiosInstance.post('/auth/login', credentials),
  logout: () => AxiosInstance.post('/auth/logout'),
  me: () => AxiosInstance.get('/auth/me'),
}

export default AuthService
