import AxiosInstance from './AxiosInstance'

const ShopService = {
  loadShopCategories: () => AxiosInstance.get('/shop/loadShopCategories'),
  loadShopProducts: (categoryId?: number) =>
    AxiosInstance.get('/shop/loadShopProducts', {
      params: categoryId ? { category_id: categoryId } : {},
    }),
  storeOrder: (data: object) => AxiosInstance.post('/shop/storeOrder', data),
  trackOrder: (orderNumber: string, customerPhone: string) =>
    AxiosInstance.get('/shop/trackOrder', {
      params: { order_number: orderNumber, customer_phone: customerPhone },
    }),
}

export default ShopService
