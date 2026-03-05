import { Search, Calendar, ChevronDown, Bell, Menu } from 'lucide-react'

function TopBar({ onMenuClick }) {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[#9BCBBF] rounded-lg transition-all duration-200"
        >
          <Menu size={24} className="text-[#334155]" />
        </button>

        <div>
          <h2 className="text-xl font-semibold text-[#334155]">
            Welcome back, Apex Printing Solutions
          </h2>
          <p className="text-sm text-[#64748B]">
            Here's what's happening with your orders today.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#9BCBBF] w-64 max-w-full"
          />
        </div>
        
        {/* Date Button */}
        <button
          onClick={() => alert("Date Range Clicked")}
          className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] 
          rounded-lg text-sm text-[#334155] 
          hover:bg-[#9BCBBF] hover:text-[#1E293B] 
          transition-all duration-200"
        >
          <Calendar size={18} />
          <span>Oct 20 - Oct 27</span>
          <ChevronDown size={16} />
        </button>
        
        {/* Notification Button */}
        <button 
          onClick={() => alert("Notifications Clicked")}
          className="p-2 rounded-lg relative 
          hover:bg-[#9BCBBF] 
          transition-all duration-200"
        >
          <Bell size={20} className="text-[#64748B]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>

      </div>
    </div>
  )
}

export default TopBar