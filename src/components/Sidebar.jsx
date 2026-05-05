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

function Sidebar({ isOpen, onClose }) {
  const { vendor, logout } = useVendorAuth()

  const handleClose = () => {
    onClose?.()
  }

  const handleLogout = async () => {
    await logout()
  }

  const linkClass = ({ isActive }) =>
    `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
      isActive
        ? 'bg-[#9BCBBF] font-semibold text-[#1E293B]'
        : 'text-[#94A3B8] hover:bg-[#9BCBBF] hover:text-[#1E293B]'
    }`

  const bottomLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
      isActive
        ? 'bg-[#9BCBBF] text-[#1E293B]'
        : 'text-white hover:bg-[#9BCBBF] hover:text-[#1E293B]'
    }`

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={handleClose} />
      ) : null}

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col overflow-y-auto bg-[#1E293B] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div>
          <button onClick={handleClose} className="absolute right-4 top-4 text-white lg:hidden">
            <X size={22} />
          </button>

          <div className="flex justify-center px-6 pt-6">
            <img src="/logo.png" alt="Ziva Print" className="h-10 w-auto" />
          </div>

          <nav className="mt-8 px-4 pb-6">
            <NavLink to="/" end className={linkClass} onClick={handleClose}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>

            <NavLink to="/incoming-orders" className={linkClass} onClick={handleClose}>
              <Inbox size={20} />
              Incoming Orders
            </NavLink>

            <NavLink to="/order-management" className={linkClass} onClick={handleClose}>
              <ShoppingCart size={20} />
              Order Management
            </NavLink>

            <NavLink to="/product-management" className={linkClass} onClick={handleClose}>
              <Package size={20} />
              Product Management
            </NavLink>

            <NavLink to="/profile-kyc" className={linkClass} onClick={handleClose}>
              <User size={20} />
              Profile & KYC
            </NavLink>

            <NavLink to="/contact-support" className={linkClass} onClick={handleClose}>
              <CircleHelp size={20} />
              Contact Support
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto border-t border-[#334155] p-4">
          <NavLink to="/apex-profile" onClick={handleClose} className={bottomLinkClass}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9BCBBF]">
              <User size={18} className="text-[#1E293B]" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">{vendor?.business_name || 'Vendor'}</p>
              <p className="truncate text-xs text-[#CBD5E1]">{vendor?.email || '-'}</p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-3 font-medium text-white transition active:scale-95"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
