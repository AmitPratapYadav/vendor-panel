import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  ShoppingCart,
  Package,
  User,
  X,
  LogOut,
} from "lucide-react";
import { useVendorAuth } from "../context/VendorAuthContext";

function MobileDrawer({ isOpen, onClose }) {
  const { vendor, logout } = useVendorAuth()

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout()
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200
     justify-start
     ${
       isActive
         ? "bg-[#9BCBBF] text-[#1E293B] font-semibold"
         : "text-[#94A3B8] hover:bg-[#9BCBBF] hover:text-[#1E293B]"
     }`;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="absolute left-0 top-0 h-full w-72 bg-[#1E293B] flex flex-col p-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white"
        >
          <X size={24} />
        </button>

        <div className="mb-8 mt-6">
          <h1 className="text-2xl font-bold text-[#9BCBBF]">
            Ziva Print
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Welcome, {vendor?.business_name || 'Vendor'}
          </p>
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
        </nav>

        <div className="border-t border-[#334155] pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#EF4444] text-white rounded-lg font-medium active:scale-95 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <p className="text-center text-xs text-[#64748B] mt-4">
            Vendor Portal • v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;