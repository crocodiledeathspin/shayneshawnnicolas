import AxiosInstance from './AxiosInstance'

const DashboardService = {
  getStats: () => AxiosInstance.get('/dashboard/getStats'),
}

export default DashboardService
