import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import IncomingOrders from './pages/IncomingOrders'
import VendorOrderDetails from './pages/VendorOrderDetails'
import OrderManagement from './pages/OrderManagement'
import ProductManagement from './pages/ProductManagement'
import VendorProductDetails from './pages/VendorProductDetails'
import ProfileKYC from './pages/ProfileKYC'
import ApexProfile from './pages/ApexProfile'
import ContactSupport from './pages/ContactSupport'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incoming-orders"
        element={
          <ProtectedRoute>
            <IncomingOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incoming-orders/:id"
        element={
          <ProtectedRoute>
            <VendorOrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <VendorOrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-management"
        element={
          <ProtectedRoute>
            <OrderManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product-management"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product-management/:id"
        element={
          <ProtectedRoute>
            <VendorProductDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile-kyc"
        element={
          <ProtectedRoute>
            <ProfileKYC />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apex-profile"
        element={
          <ProtectedRoute>
            <ApexProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact-support"
        element={
          <ProtectedRoute>
            <ContactSupport />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
