import AxiosInstance from './AxiosInstance'

const DebtService = {
  loadDebts: (page = 1, status = 'all', search = '') =>
    AxiosInstance.get('/debt/loadDebts', { params: { page, status, search } }),
  storeDebt: (data: {
    customer_name: string
    customer_phone?: string
    amount: number
    description?: string
    debt_date?: string
  }) => AxiosInstance.post('/debt/storeDebt', data),
  recordPayment: (debtId: number, payment_amount: number) =>
    AxiosInstance.put(`/debt/recordPayment/${debtId}`, { payment_amount }),
  destroyDebt: (debtId: number) => AxiosInstance.put(`/debt/destroyDebt/${debtId}`),
}

export default DebtService
