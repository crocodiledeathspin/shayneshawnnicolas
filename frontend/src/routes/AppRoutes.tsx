import { Route, Routes } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import CustomerLayout from '../layout/CustomerLayout'
import LoginPage from '../pages/Auth/LoginPage'
import ProtectedRoute from './ProtectedRoute'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import CategoryMainPage from '../pages/Category/CategoryMainPage'
import EditCategoryPage from '../pages/Category/EditCategoryPage'
import DeleteCategoryPage from '../pages/Category/DeleteCategoryPage'
import ProductMainPage from '../pages/Product/ProductMainPage'
import SaleMainPage from '../pages/Sale/SaleMainPage'
import StaffMainPage from '../pages/Staff/StaffMainPage'
import CustomerDebtsMainPage from '../pages/Debt/CustomerDebtsMainPage'
import OrdersMainPage from '../pages/Order/OrdersMainPage'
import ShopPage from '../pages/Shop/ShopPage'
import CartPage from '../pages/Shop/CartPage'
import CheckoutPage from '../pages/Shop/CheckoutPage'
import OrderSuccessPage from '../pages/Shop/OrderSuccessPage'
import TrackOrderPage from '../pages/Shop/TrackOrderPage'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />

    {/* Customer shop — no login */}
    <Route path="/shop" element={<CustomerLayout />}>
      <Route index element={<ShopPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="success/:orderNumber" element={<OrderSuccessPage />} />
      <Route path="track" element={<TrackOrderPage />} />
    </Route>

    {/* Admin — staff login required */}
    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/orders" element={<OrdersMainPage />} />
      <Route path="/categories" element={<CategoryMainPage />} />
      <Route path="/category/edit/:category_id" element={<EditCategoryPage />} />
      <Route path="/category/delete/:category_id" element={<DeleteCategoryPage />} />
      <Route path="/products" element={<ProductMainPage />} />
      <Route path="/sales" element={<SaleMainPage />} />
      <Route path="/debts" element={<CustomerDebtsMainPage />} />
      <Route path="/staff" element={<StaffMainPage />} />
    </Route>
  </Routes>
)

export default AppRoutes
