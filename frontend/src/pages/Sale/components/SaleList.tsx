import { useEffect, useState, type FC } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/table'
import SaleService from '../../../services/SaleService'
import Spinner from '../../../components/Spinner/Spinner'
import type { SaleColumns } from '../../../interfaces/SaleColumns'

interface Props {
  refreshKey: boolean
  onCancel: (msg: string, failed?: boolean) => void
  triggerRefresh: () => void
}

const SaleList: FC<Props> = ({ refreshKey, onCancel, triggerRefresh }) => {
  const [sales, setSales] = useState<SaleColumns[]>([])
  const [loading, setLoading] = useState(false)

  const loadSales = () => {
    setLoading(true)
    SaleService.loadSales()
      .then((res) => setSales(res.data.sales || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSales() }, [refreshKey])

  const handleCancel = async (saleId: number) => {
    if (!confirm('Cancel this sale? Stock will be restored.')) return
    try {
      const res = await SaleService.destroySale(saleId)
      onCancel(res.data.message)
      triggerRefresh()
      loadSales()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      onCancel(e.response?.data?.message || 'Failed to cancel sale', true)
    }
  }

  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <h2 className="font-semibold p-4 border-b">Recent Sales</h2>
      <Table>
        <TableHeader className="bg-orange-600 text-white text-xs">
          <TableRow>
            <TableCell isHeader className="px-3 py-3">Date</TableCell>
            <TableCell isHeader className="px-3 py-3">Product</TableCell>
            <TableCell isHeader className="px-3 py-3">Qty</TableCell>
            <TableCell isHeader className="px-3 py-3">Total</TableCell>
            <TableCell isHeader className="px-3 py-3">Staff</TableCell>
            <TableCell isHeader className="px-3 py-3">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm divide-y">
          {loading ? (
            <TableRow><TableCell colSpan={6} className="py-6"><Spinner /></TableCell></TableRow>
          ) : sales.length ? (
            sales.map((s) => (
              <TableRow key={s.sale_id}>
                <TableCell className="px-3 py-3">{new Date(s.sale_date).toLocaleString()}</TableCell>
                <TableCell className="px-3 py-3">
                  {s.product?.product_name}
                  {s.order_id && (
                    <span className="block text-xs text-orange-600">Online order</span>
                  )}
                </TableCell>
                <TableCell className="px-3 py-3">{s.quantity}</TableCell>
                <TableCell className="px-3 py-3">₱{Number(s.total_amount).toFixed(2)}</TableCell>
                <TableCell className="px-3 py-3">{s.user?.full_name}</TableCell>
                <TableCell className="px-3 py-3">
                  {s.order_id ? (
                    <span className="text-xs text-gray-400">Cancel via Orders</span>
                  ) : (
                    <button onClick={() => handleCancel(s.sale_id)} className="text-red-600 hover:underline text-xs">
                      Cancel
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={6} className="py-6 text-center text-gray-500">No sales yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default SaleList
