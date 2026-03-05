import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

function IncomingOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="lg:ml-60">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Incoming Orders
          </h1>
        </div>

      </div>
    </div>
  )
}

export default IncomingOrders