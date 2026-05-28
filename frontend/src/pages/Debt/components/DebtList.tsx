import { useEffect, useState, type FC, type FormEvent } from 'react'
import DebtService from '../../../services/DebtService'
import Spinner from '../../../components/Spinner/Spinner'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/table'
import FloatingLabelInput from '../../../components/Inputs/FloatingLabelInput'
import SubmitButton from '../../../components/Button/SubmitButton'
import Modal from '../../../components/Modal'
import { useModal } from '../../../hooks/useModal'

interface DebtRow {
  debt_id: number
  customer_name: string
  customer_phone: string | null
  amount: string
  amount_paid: string
  description: string | null
  debt_date: string
  status: 'open' | 'paid'
  recorder?: { full_name: string }
}

interface Props {
  refreshKey: boolean
  onAction: (msg: string, failed?: boolean) => void
  triggerRefresh: () => void
}

const DebtList: FC<Props> = ({ refreshKey, onAction, triggerRefresh }) => {
  const [debts, setDebts] = useState<DebtRow[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [openBalance, setOpenBalance] = useState('0.00')
  const [openCount, setOpenCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const addModal = useModal()
  const payModal = useModal()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<DebtRow | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    amount: '',
    description: '',
    debt_date: new Date().toISOString().slice(0, 10),
  })

  const loadDebts = (pageNum = 1, append = false) => {
    setLoading(true)
    DebtService.loadDebts(pageNum, statusFilter, search)
      .then((res) => {
        const list = res.data.debts || []
        setDebts((prev) => (append ? [...prev, ...list] : list))
        setOpenBalance(res.data.open_balance_total || '0.00')
        setOpenCount(res.data.open_debt_count || 0)
        setHasMore(res.data.has_more_pages)
        setPage(res.data.current_page)
      })
      .catch(() => {
        if (!append) setDebts([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1)
    loadDebts(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, statusFilter])

  const handleSearch = () => {
    setPage(1)
    loadDebts(1)
  }

  const balanceOf = (d: DebtRow) =>
    Math.max(0, Number(d.amount) - Number(d.amount_paid))

  const handleAddDebt = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      const res = await DebtService.storeDebt({
        customer_name: form.customer_name,
        customer_phone: form.customer_phone || undefined,
        amount: Number(form.amount),
        description: form.description || undefined,
        debt_date: form.debt_date,
      })
      onAction(res.data.message)
      addModal.closeModal()
      setForm({
        customer_name: '',
        customer_phone: '',
        amount: '',
        description: '',
        debt_date: new Date().toISOString().slice(0, 10),
      })
      triggerRefresh()
      loadDebts(1)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      onAction(e.response?.data?.message || 'Failed to record debt', true)
    } finally {
      setSubmitLoading(false)
    }
  }

  const openPayment = (debt: DebtRow) => {
    setSelectedDebt(debt)
    setPaymentAmount(String(balanceOf(debt)))
    payModal.openModal()
  }

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedDebt) return
    setSubmitLoading(true)
    try {
      const res = await DebtService.recordPayment(
        selectedDebt.debt_id,
        Number(paymentAmount),
      )
      onAction(res.data.message)
      payModal.closeModal()
      triggerRefresh()
      loadDebts(1)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      onAction(e.response?.data?.message || 'Payment failed', true)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleRemove = async (debtId: number) => {
    if (!confirm('Remove this debt record? Use only for mistaken entries.')) return
    try {
      const res = await DebtService.destroyDebt(debtId)
      onAction(res.data.message)
      triggerRefresh()
      loadDebts(1)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      onAction(e.response?.data?.message || 'Failed to remove record', true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total open utang balance</p>
          <p className="text-2xl font-bold text-orange-700">₱{Number(openBalance).toFixed(2)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Open debt records</p>
          <p className="text-2xl font-bold text-gray-800">{openCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => addModal.openModal()}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          + Record Debt
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="paid">Paid</option>
        </select>
        <input
          type="search"
          placeholder="Search name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px]"
        />
        <button onClick={handleSearch} className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-orange-600 text-white text-xs">
            <TableRow>
              <TableCell isHeader className="px-3 py-3">Date</TableCell>
              <TableCell isHeader className="px-3 py-3">Customer</TableCell>
              <TableCell isHeader className="px-3 py-3">Amount</TableCell>
              <TableCell isHeader className="px-3 py-3">Paid</TableCell>
              <TableCell isHeader className="px-3 py-3">Balance</TableCell>
              <TableCell isHeader className="px-3 py-3">Status</TableCell>
              <TableCell isHeader className="px-3 py-3">Recorded by</TableCell>
              <TableCell isHeader className="px-3 py-3">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm divide-y">
            {loading && !debts.length ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : debts.length ? (
              debts.map((d) => (
                <TableRow key={d.debt_id}>
                  <TableCell className="px-3 py-3">
                    {new Date(d.debt_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <span className="font-medium">{d.customer_name}</span>
                    {d.customer_phone && (
                      <span className="block text-xs text-gray-500">{d.customer_phone}</span>
                    )}
                    {d.description && (
                      <span className="block text-xs text-gray-400">{d.description}</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-3">₱{Number(d.amount).toFixed(2)}</TableCell>
                  <TableCell className="px-3 py-3">₱{Number(d.amount_paid).toFixed(2)}</TableCell>
                  <TableCell className="px-3 py-3 font-medium">
                    ₱{balanceOf(d).toFixed(2)}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        d.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-3">{d.recorder?.full_name || '—'}</TableCell>
                  <TableCell className="px-3 py-3 space-x-2">
                    {d.status === 'open' && (
                      <button
                        onClick={() => openPayment(d)}
                        className="text-orange-600 hover:underline text-xs"
                      >
                        Payment
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(d.debt_id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                  No debt records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {hasMore && (
          <div className="p-4 text-center">
            <button
              onClick={() => loadDebts(page + 1, true)}
              className="text-orange-600 text-sm hover:underline"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.closeModal} title="Record customer debt">
        <form onSubmit={handleAddDebt} className="space-y-4">
          <FloatingLabelInput
            label="Customer name"
            name="customer_name"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            required
          />
          <FloatingLabelInput
            label="Phone (optional)"
            name="customer_phone"
            value={form.customer_phone}
            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
          />
          <FloatingLabelInput
            label="Amount (₱)"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <FloatingLabelInput
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <FloatingLabelInput
            label="Debt date"
            name="debt_date"
            type="date"
            value={form.debt_date}
            onChange={(e) => setForm({ ...form, debt_date: e.target.value })}
            required
          />
          <SubmitButton label="Save debt record" loading={submitLoading} />
        </form>
      </Modal>

      <Modal isOpen={payModal.isOpen} onClose={payModal.closeModal} title="Record payment">
        {selectedDebt && (
          <form onSubmit={handlePayment} className="space-y-4">
            <p className="text-sm text-gray-600">
              {selectedDebt.customer_name} — remaining balance: ₱
              {balanceOf(selectedDebt).toFixed(2)}
            </p>
            <FloatingLabelInput
              label="Payment amount (₱)"
              name="payment_amount"
              type="number"
              step="0.01"
              min="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />
            <SubmitButton label="Apply payment" loading={submitLoading} />
          </form>
        )}
      </Modal>
    </div>
  )
}

export default DebtList
