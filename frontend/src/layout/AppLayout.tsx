import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'
import { SidebarProvider } from '../contexts/SidebarContext'
import { HeaderProvider } from '../contexts/HeaderContext'

const AppLayout = () => (
  <HeaderProvider>
    <SidebarProvider>
      <AppSidebar />
      <AppHeader />
      <div className="pt-20 pl-0 sm:pl-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  </HeaderProvider>
)

export default AppLayout
