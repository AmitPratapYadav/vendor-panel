import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileHeader from './MobileHeader'
import MobileDrawer from './MobileDrawer'

function VendorAppLayout({ title, subtitle, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="hidden lg:block">
        <Sidebar isOpen={true} />
      </div>

      <div className="lg:hidden">
        <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
        <MobileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>

      <div className="lg:ml-64 min-h-screen">
        <div className="hidden lg:block">
          <TopBar onMenuClick={() => {}} />
        </div>

        <main className="p-4 lg:p-6">
          {(title || subtitle) ? (
            <div className="mb-6">
              {title ? (
                <h1 className="text-2xl font-bold text-[#334155]">{title}</h1>
              ) : null}
              {subtitle ? (
                <p className="text-sm text-[#64748B] mt-1">{subtitle}</p>
              ) : null}
            </div>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  )
}

export default VendorAppLayout