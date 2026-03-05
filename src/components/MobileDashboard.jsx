  import { useState } from 'react'
  import MobileHeader from './MobileHeader'
  import MobileDrawer from './MobileDrawer'
  import MobileOrderCard from './MobileOrderCard'
  import MobileMetricCard from './MobileMetricCard'
  import MobileKYCCard from './MobileKYCCard'

  import ChartPlaceholder from './ChartPlaceholder'
  import ResourceAllocation from './ResourceAllocation'

  import { mobileMetrics } from './data/dummyData'

  function MobileDashboard() {

    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleSignOut = () => {
      alert("Signed Out Successfully")
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC]">

        <MobileHeader onMenuClick={() => setDrawerOpen(true)} />

        <MobileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <main className="p-4">

          {/* Incoming Order */}
          <MobileOrderCard />

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {mobileMetrics.map((metric, idx) => (
              <MobileMetricCard key={idx} {...metric} />
            ))}
          </div>

          {/* KYC Card */}
          <MobileKYCCard />

          {/* ✅ NEW SECTION (Desktop wale 2 cards mobile me) */}

          <div className="space-y-4 mb-4">

            {/* Production Output */}
            <ChartPlaceholder />

            {/* Resource Allocation */}
            <ResourceAllocation />

          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full py-3 bg-[#EF4444] text-white font-medium rounded-xl mb-4 hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Sign Out
          </button>

          <p className="text-center text-xs text-[#64748B]">
            System Status: Online • v1.0.0
          </p>

        </main>
      </div>
    )
  }

  export default MobileDashboard