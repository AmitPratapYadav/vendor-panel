import { Search, Bell, Menu } from 'lucide-react'
import { useVendorAuth } from '../context/VendorAuthContext'

function TopBar({ onMenuClick }) {
  const { vendor } = useVendorAuth()

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[#9BCBBF] rounded-lg transition-all duration-200"
        >
          <Menu size={24} className="text-[#334155]" />
        </button>

        <div>
          <h2 className="text-xl font-semibold text-[#334155]">
            Welcome back, {vendor?.business_name || 'Vendor'}
          </h2>
          <p className="text-sm text-[#64748B]">
            Manage incoming jobs and production updates.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#9BCBBF] w-64 max-w-full"
          />
        </div>

        <button
          className="p-2 rounded-lg relative hover:bg-[#9BCBBF] transition-all duration-200"
        >
          <Bell size={20} className="text-[#64748B]" />
        </button>
      </div>
    </div>
  )
}

export default TopBar