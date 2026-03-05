import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { dummyOrders } from './data/dummyData'

function OrdersTable() {

  const [orders, setOrders] = useState(dummyOrders)

  const handleAccept = (id) => {
    alert(`Order ${id} Accepted`)
    setOrders(prev => prev.filter(order => order.id !== id))
  }

  const handleDecline = (id) => {
    alert(`Order ${id} Declined`)
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">

      {/* Header Section */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#334155]">
              Action Required: Incoming Orders
            </h3>
            <p className="text-sm text-[#64748B]">
              Please accept or decline within 2 hours
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => alert("Filter Clicked")}
              className="px-4 py-2 bg-[#9BCBBF] text-[#1E293B] text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
            >
              Filter
            </button>

            <button
              onClick={() => alert("Export CSV Clicked")}
              className="px-4 py-2 bg-[#9BCBBF] text-[#1E293B] text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">

          {/* Clickable Header */}
          <thead>
            <tr className="bg-[#F8FAFC]">

              <th
                onClick={() => alert("Order ID Clicked")}
                className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase cursor-pointer hover:bg-[#9BCBBF] hover:text-[#1E293B] transition-all duration-200"
              >
                Order ID
              </th>

              <th
                onClick={() => alert("Print Type Clicked")}
                className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase cursor-pointer hover:bg-[#9BCBBF] hover:text-[#1E293B] transition-all duration-200"
              >
                Print Type
              </th>

              <th
                onClick={() => alert("Quantity Clicked")}
                className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase cursor-pointer hover:bg-[#9BCBBF] hover:text-[#1E293B] transition-all duration-200"
              >
                Quantity
              </th>

              <th
                onClick={() => alert("Deadline Clicked")}
                className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase cursor-pointer hover:bg-[#9BCBBF] hover:text-[#1E293B] transition-all duration-200"
              >
                Deadline
              </th>

              <th
                onClick={() => alert("Actions Clicked")}
                className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase cursor-pointer hover:bg-[#9BCBBF] hover:text-[#1E293B] transition-all duration-200"
              >
                Actions
              </th>

            </tr>
          </thead>

          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-t border-[#E2E8F0] hover:bg-[#F1F5F9]">

                <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                  {order.id}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 bg-[#9BCBBF] text-[#1E293B] text-xs font-medium rounded-full">
                    {order.printType}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-[#334155]">
                  {order.quantity}
                </td>

                <td className="px-6 py-4">
                  <span className={`text-sm ${order.isToday ? 'text-[#EF4444] font-medium' : 'text-[#334155]'}`}>
                    {order.deadline}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">

                    <button
                      onClick={() => handleAccept(order.id)}
                      className="px-4 py-2 bg-[#9BCBBF] text-[#1E293B] text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                    >
                      Accept Job
                    </button>

                    <button
                      onClick={() => handleDecline(order.id)}
                      className="px-4 py-2 border border-[#E2E8F0] text-[#334155] text-sm font-medium rounded-lg hover:bg-[#F1F5F9] transition-all duration-200"
                    >
                      Decline
                    </button>

                    <button
                      onClick={() => alert("More Options")}
                      className="p-2 rounded-lg hover:bg-[#F1F5F9]"
                    >
                      <MoreVertical size={18} className="text-[#64748B]" />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E2E8F0] text-center">
        <p className="text-sm text-[#64748B]">
          Showing {orders.length} incoming orders
        </p>
      </div>

    </div>
  )
}

export default OrdersTable