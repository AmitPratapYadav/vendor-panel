import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import StatsCard from './StatsCard'
import OrdersTable from './OrdersTable'
import ChartPlaceholder from './ChartPlaceholder'
import ResourceAllocation from './ResourceAllocation'
import { dummyStats } from './data/dummyData'

function DesktopDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-60">

        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {dummyStats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>

          <OrdersTable />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartPlaceholder />
            <ResourceAllocation />
          </div>

        </main>

      </div>
    </div>
  )
}

export default DesktopDashboard