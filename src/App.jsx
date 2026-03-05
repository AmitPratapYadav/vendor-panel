import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

import DesktopDashboard from './components/DesktopDashboard'
import MobileDashboard from './components/MobileDashboard'

import IncomingOrders from './pages/IncomingOrders'
import OrderManagement from './pages/OrderManagement'
import ProductManagement from './pages/ProductManagement'
import ProfileKYC from './pages/ProfileKYC'
import ApexProfile from './pages/ApexProfile'

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
      <Route
        path="/"
        element={isMobile ? <MobileDashboard /> : <DesktopDashboard />}
      />

      <Route path="/incoming-orders" element={<IncomingOrders />} />
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/product-management" element={<ProductManagement />} />
      <Route path="/profile-kyc" element={<ProfileKYC />} />
      <Route path="/apex-profile" element={<ApexProfile />} />
    </Routes>
  )
}

export default App