import { NavLink } from 'react-router-dom'
import {
  CircleHelp,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { useVendorAuth } from '../context/VendorAuthContext'

function MobileDrawer({ isOpen, onClose }) {
  const { vendor, logout } = useVendorAuth()

  if (!isOpen) return null

  const handleLogout = async () => {
    await logout()
  }

  const linkClass = ({ isActive }) =>
    `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
      isActive
        ? 'bg-[#9BCBBF] font-semibold text-[#1E293B]'
        : 'text-[#94A3B8] hover:bg-[#9BCBBF] hover:text-[#1E293B]'
    }`

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[#1E293B] p-5">
        <button onClick={onClose} className="absolute right-4 top-4 text-white">
          <X size={24} />
        </button>

        <div className="mb-8 mt-6">
          <img src="/logo.png" alt="Ziva Print" className="h-10 w-auto" />
          <p className="mt-3 text-sm text-[#94A3B8]">Welcome, {vendor?.business_name || 'Vendor'}</p>
        </div>

        <nav className="flex-1">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/incoming-orders" className={linkClass} onClick={onClose}>
            <Inbox size={20} />
            <span>Incoming Orders</span>
          </NavLink>

          <NavLink to="/order-management" className={linkClass} onClick={onClose}>
            <ShoppingCart size={20} />
            <span>Order Management</span>
          </NavLink>

          <NavLink to="/product-management" className={linkClass} onClick={onClose}>
            <Package size={20} />
            <span>Product Management</span>
          </NavLink>

          <NavLink to="/profile-kyc" className={linkClass} onClick={onClose}>
            <User size={20} />
            <span>Profile & KYC</span>
          </NavLink>

          <NavLink to="/contact-support" className={linkClass} onClick={onClose}>
            <CircleHelp size={20} />
            <span>Contact Support</span>
          </NavLink>
        </nav>

        <div className="border-t border-[#334155] pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-3 font-medium text-white transition active:scale-95"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <p className="mt-4 text-center text-xs text-[#64748B]">{vendor?.email || '-'}</p>
        </div>
      </div>
    </div>
  )
}

export default MobileDrawer
