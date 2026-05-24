import AxiosInstance from './AxiosInstance'

const StaffService = {
  loadStaff: (search = '') =>
    AxiosInstance.get('/staff/loadStaff', { params: { search } }),
  storeStaff: (data: object) => AxiosInstance.post('/staff/storeStaff', data),
  updateStaff: (staffId: number, data: object) =>
    AxiosInstance.put(`/staff/updateStaff/${staffId}`, data),
  destroyStaff: (staffId: number) =>
    AxiosInstance.put(`/staff/destroyStaff/${staffId}`),
}

export default StaffService
