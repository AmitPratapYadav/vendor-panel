import { Navigate } from 'react-router-dom'
import { useVendorAuth } from '../context/VendorAuthContext'

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useVendorAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-[#334155] text-sm font-medium">Loading vendor portal...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute