import { useEffect, useState } from 'react'
import DashboardService from '../../services/DashboardService'
import Spinner from '../../components/Spinner/Spinner'

interface DashboardStats {
  today_sales: string
  today_transactions: number
  total_products: number
  low_stock_count: number
  pending_orders: number
  sales_by_category: { category_name: string; total: string }[]
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Dashboard - Aling Rosa's Store"
    DashboardService.getStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner size="lg" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Today's Sales" value={`₱${stats?.today_sales || '0.00'}`} color="orange" />
        <StatCard title="Transactions Today" value={String(stats?.today_transactions || 0)} color="blue" />
        <StatCard title="Pending Orders" value={String(stats?.pending_orders || 0)} color="red" />
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
  }
  return (
    <div className={`rounded-lg border-l-4 p-4 ${colors[color]}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  )
}

export default DashboardPage
