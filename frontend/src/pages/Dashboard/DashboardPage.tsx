import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardService from '../../services/DashboardService'
import Spinner from '../../components/Spinner/Spinner'

interface DashboardStats {
  today_sales: string
  today_transactions: number
  total_products: number
  low_stock_count: number
  pending_orders: number
  open_debt_count: number
  open_debt_balance: string
  sales_by_category: { category_name: string; total: string }[]
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Dashboard - Jojo Store and Snackhouse'
    DashboardService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Jojo Store and Snackhouse — sari-sari (7 years) and snack house operations at a glance.
      </p>
      {(stats?.pending_orders ?? 0) > 0 && (
        <Link
          to="/orders"
          className="block mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 hover:bg-red-100"
        >
          {stats?.pending_orders} pending online order(s) — manage in Orders
        </Link>
      )}
      {(stats?.open_debt_count ?? 0) > 0 && (
        <Link
          to="/debts"
          className="block mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 hover:bg-amber-100"
        >
          ₱{Number(stats?.open_debt_balance || 0).toFixed(2)} open customer utang ({stats?.open_debt_count}{' '}
          record(s)) — view debt records
        </Link>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Today's Sales" value={`₱${stats?.today_sales || '0.00'}`} color="orange" />
        <StatCard title="Transactions Today" value={String(stats?.today_transactions || 0)} color="blue" />
        <StatCard title="Pending Orders" value={String(stats?.pending_orders || 0)} color="red" />
        <StatCard title="Open Utang" value={`₱${Number(stats?.open_debt_balance || 0).toFixed(2)}`} color="amber" />
        <StatCard title="Total Products" value={String(stats?.total_products || 0)} color="green" />
        <StatCard title="Low Stock Items" value={String(stats?.low_stock_count || 0)} color="red" />
      </div>
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Today&apos;s Sales by Category</h2>
        {stats?.sales_by_category?.length ? (
          <ul className="space-y-2">
            {stats.sales_by_category.map((item, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span>{item.category_name}</span>
                <span className="font-semibold text-orange-600">₱{Number(item.total).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sales recorded today yet.</p>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ title, value, color }: { title: string; value: string; color: string }) => {
  const colors: Record<string, string> = {
    orange: 'border-orange-500 bg-orange-50',
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    red: 'border-red-500 bg-red-50',
    amber: 'border-amber-500 bg-amber-50',
  }
  return (
    <div className={`rounded-lg border-l-4 p-4 ${colors[color] || colors.orange}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  )
}

export default DashboardPage
