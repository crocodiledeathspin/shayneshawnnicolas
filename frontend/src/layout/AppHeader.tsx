import { useAuth } from '../contexts/AuthContext'
import { useHeader } from '../contexts/HeaderContext'
import { useSidebar } from '../contexts/SidebarContext'
import { useNavigate } from 'react-router-dom'

const AppHeader = () => {
  const { user, logout } = useAuth()
  const { isMenuOpen, toggleMenu } = useHeader()
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ☰
          </button>
          <span className="font-bold text-orange-600 text-lg">
            Aling Rosa&apos;s Store
          </span>
        </div>
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            {user?.full_name} ({user?.role})
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default AppHeader
