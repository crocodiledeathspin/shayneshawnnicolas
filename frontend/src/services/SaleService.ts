import AxiosInstance from './AxiosInstance'

const SaleService = {
  loadSales: (page = 1, search = '') =>
    AxiosInstance.get('/sale/loadSales', { params: { page, search } }),
  storeSale: (data: {
    product: number
    quantity: number
    notes?: string
  }) => AxiosInstance.post('/sale/storeSale', data),
  destroySale: (saleId: number) =>
    AxiosInstance.put(`/sale/destroySale/${saleId}`),
}

export default SaleService
