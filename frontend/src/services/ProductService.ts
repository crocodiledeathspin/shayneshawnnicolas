import AxiosInstance from './AxiosInstance'

const ProductService = {
  loadProducts: (page = 1, search = '') =>
    AxiosInstance.get('/product/loadProducts', { params: { page, search } }),
  loadLowStockProducts: () =>
    AxiosInstance.get('/product/loadLowStockProducts'),
  storeProduct: (data: FormData) =>
    AxiosInstance.post('/product/storeProduct', data),
  updateProduct: (productId: number, data: FormData) =>
    AxiosInstance.post(`/product/updateProduct/${productId}`, data),
  destroyProduct: (productId: number) =>
    AxiosInstance.put(`/product/destroyProduct/${productId}`),
}

export default ProductService
