import AxiosInstance from './AxiosInstance'

const OrderService = {
  loadOrders: (page = 1, status = 'all', search = '') =>
    AxiosInstance.get('/order/loadOrders', { params: { page, status, search } }),
  getOrder: (orderId: number) => AxiosInstance.get(`/order/getOrder/${orderId}`),
  updateOrderStatus: (orderId: number, status: string) =>
    AxiosInstance.put(`/order/updateOrderStatus/${orderId}`, { status }),
}

export default OrderService
