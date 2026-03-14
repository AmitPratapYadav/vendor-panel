import { useState } from 'react'
import MobileHeader from './MobileHeader'
import MobileDrawer from './MobileDrawer'
import MobileOrderCard from './MobileOrderCard'
import MobileMetricCard from './MobileMetricCard'
import MobileKYCCard from './MobileKYCCard'
import ChartPlaceholder from './ChartPlaceholder'
import ResourceAllocation from './ResourceAllocation'
import { mobileMetrics } from './data/dummyData'
import { useVendorAuth } from '../context/VendorAuthContext'

function MobileDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { logout } = useVendorAuth()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="p-4">
        <MobileOrderCard />

        <div className="grid grid-cols-2 gap-4 mb-4">
          {mobileMetrics.map((metric, idx) => (
            <MobileMetricCard key={idx} {...metric} />
          ))}
        </div>

        <MobileKYCCard />

        <div className="space-y-4 mb-4">
          <ChartPlaceholder />
          <ResourceAllocation />
        </div>

        <button
          onClick={logout}
          className="w-full py-3 bg-[#EF4444] text-white font-medium rounded-xl mb-4 hover:opacity-90 active:scale-95 transition-all duration-200"
        >
          Sign Out
        </button>

        <p className="text-center text-xs text-[#64748B]">
          Vendor Portal • v1.0.0
        </p>
      </main>
    </div>
  )
}

export default MobileDashboard