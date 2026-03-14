import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

import DesktopDashboard from './components/DesktopDashboard'
import MobileDashboard from './components/MobileDashboard'
import ProtectedRoute from './components/ProtectedRoute'

import IncomingOrders from './pages/IncomingOrders'
import VendorOrderDetails from './pages/VendorOrderDetails'
import OrderManagement from './pages/OrderManagement'
import ProductManagement from './pages/ProductManagement'
import ProfileKYC from './pages/ProfileKYC'
import ApexProfile from './pages/ApexProfile'
import Login from './pages/Login'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            {isMobile ? <MobileDashboard /> : <DesktopDashboard />}
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
    </Routes>
  )
}

export default App