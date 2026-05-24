import AxiosInstance from './AxiosInstance'

const CategoryService = {
  loadCategories: () => AxiosInstance.get('/category/loadCategories'),
  getCategory: (categoryId: number) =>
    AxiosInstance.get(`/category/getCategory/${categoryId}`),
  storeCategory: (data: { category_name: string; description?: string }) =>
    AxiosInstance.post('/category/storeCategory', data),
  updateCategory: (
    categoryId: number,
    data: { category_name: string; description?: string },
  ) => AxiosInstance.put(`/category/updateCategory/${categoryId}`, data),
  destroyCategory: (categoryId: number) =>
    AxiosInstance.put(`/category/destroyCategory/${categoryId}`),
}

export default CategoryService
