import { Link, useLocation } from 'react-router-dom'
import { useSidebar } from '../contexts/SidebarContext'

const sidebarItems = [
  { path: '/dashboard', text: 'Dashboard' },
  { path: '/orders', text: 'Orders' },
  { path: '/categories', text: 'Categories' },
  { path: '/products', text: 'Products' },
  { path: '/sales', text: 'Sales' },
  { path: '/staff', text: 'Staff' },
]

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar()
  const location = useLocation()

  return (
    <>
      {!isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 sm:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? '-translate-x-full' : 'translate-x-0'
        } bg-white border-r border-gray-200 sm:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-1 font-medium">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar
