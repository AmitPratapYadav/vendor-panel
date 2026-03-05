import { Printer, Clock, Filter, Download } from 'lucide-react'

function MobileOrderCard() {

  const handleAccept = () => {
    alert("Order Accepted")
  }

  const handleDecline = () => {
    alert("Order Declined")
  }

  const handleFilter = () => {
    alert("Filter Clicked")
  }

  const handleExport = () => {
    alert("Export CSV Clicked")
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md mb-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <span className="text-lg font-semibold text-[#334155]">
          #ZP-88421
        </span>

        <span className="px-3 py-1 bg-[#9BCBBF] text-[#0F172A] text-xs font-medium rounded-full">
          New Order
        </span>
      </div>

      {/* PRINT TYPE */}
      <div className="flex items-center gap-2 mb-2">
        <Printer size={16} className="text-[#64748B]" />
        <span className="text-sm text-[#334155]">
          DTG Printing
        </span>
      </div>

      {/* DEADLINE */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-[#64748B]" />
        <span className="text-sm text-[#334155]">
          Due: Today, 5:00 PM
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mb-4">

        <button
          onClick={handleAccept}
          className="flex-1 py-3 bg-[#9BCBBF] text-[#1E293B] font-medium rounded-xl hover:opacity-90 active:scale-95 transition"
        >
          Accept
        </button>

        <button
          onClick={handleDecline}
          className="flex-1 py-3 border border-[#E2E8F0] text-[#334155] font-medium rounded-xl hover:bg-[#F1F5F9] active:scale-95 transition"
        >
          Decline
        </button>

      </div>

      {/* FILTER + EXPORT */}
      <div className="flex gap-3">

        <button
          onClick={handleFilter}
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#E2E8F0] rounded-lg text-sm hover:bg-[#F1F5F9]"
        >
          <Filter size={16} />
          Filter
        </button>

        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#E2E8F0] rounded-lg text-sm hover:bg-[#F1F5F9]"
        >
          <Download size={16} />
          Export CSV
        </button>

      </div>

    </div>
  )
}

export default MobileOrderCard