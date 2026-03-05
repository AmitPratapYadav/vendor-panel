import { Menu, Bell, Search, Calendar, ChevronDown } from 'lucide-react'
import { useState } from 'react'

function MobileHeader({ onMenuClick }) {

  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    setSearch(e.target.value)
    console.log("Searching:", e.target.value)
  }

  const handleCalendar = () => {
    alert("Date Range Clicked")
  }

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 sticky top-0 z-40">

      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-3">

        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[#9BCBBF] active:scale-95 rounded-lg transition"
        >
          <Menu size={24} className="text-[#334155]" />
        </button>

        <h1 className="text-lg font-semibold text-[#334155]">
          VENDOR PORTAL
        </h1>

        <button
          onClick={() => alert("Notifications Clicked")}
          className="p-2 hover:bg-[#9BCBBF] rounded-lg relative"
        >
          <Bell size={20} className="text-[#334155]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-3">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />

        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#9BCBBF]"
        />
      </div>

      {/* DATE BUTTON */}
      <button
        onClick={handleCalendar}
        className="flex items-center justify-between w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#334155] hover:bg-[#9BCBBF] hover:text-[#1E293B] transition"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <span>Oct 20 - Oct 27</span>
        </div>

        <ChevronDown size={16} />
      </button>

    </div>
  )
}

export default MobileHeader