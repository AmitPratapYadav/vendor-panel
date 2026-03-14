import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import VendorAppLayout from '../components/VendorAppLayout'
import {
  fetchVendorOrders,
  markVendorOrderProcessing,
  markVendorOrderDispatched,
} from '../services/vendorOrders'

function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('accepted')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const [acceptedData, processingData, dispatchedData] = await Promise.all([
        fetchVendorOrders({ assignment_status: 'accepted' }),
        fetchVendorOrders({ order_status: 'processing' }),
        fetchVendorOrders({ order_status: 'dispatched' }),
      ])

      const acceptedOrders = (acceptedData?.data || []).filter(
        (order) => order.status === 'pending' || order.status === 'accepted'
      )

      const processingOrders = processingData?.data || []
      const dispatchedOrders = dispatchedData?.data || []

      setOrders([
        ...acceptedOrders.map((order) => ({ ...order, _bucket: 'accepted' })),
        ...processingOrders.map((order) => ({ ...order, _bucket: 'processing' })),
        ...dispatchedOrders.map((order) => ({ ...order, _bucket: 'dispatched' })),
      ])
    } catch (err) {
      setError(err.message || 'Unable to load order management data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const groupedOrders = useMemo(() => {
    return {
      accepted: orders.filter((order) => order._bucket === 'accepted'),
      processing: orders.filter((order) => order._bucket === 'processing'),
      dispatched: orders.filter((order) => order._bucket === 'dispatched'),
    }
  }, [orders])

  const visibleOrders = groupedOrders[activeTab] || []

  const handleMarkProcessing = async (orderId) => {
    try {
      setActionLoadingId(orderId)
      await markVendorOrderProcessing(orderId)
      await loadOrders()
    } catch (err) {
      alert(err.message || 'Unable to mark order as processing.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleMarkDispatched = async (orderId) => {
    try {
      setActionLoadingId(orderId)
      await markVendorOrderDispatched(orderId)
      await loadOrders()
    } catch (err) {
      alert(err.message || 'Unable to mark order as dispatched.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const tabs = [
    { key: 'accepted', label: 'Accepted', count: groupedOrders.accepted.length },
    { key: 'processing', label: 'Processing', count: groupedOrders.processing.length },
    { key: 'dispatched', label: 'Dispatched', count: groupedOrders.dispatched.length },
  ]

  return (
    <VendorAppLayout
      title="Order Management"
      subtitle="Manage accepted jobs through production and dispatch."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-white border border-[#CBD5E1] text-[#334155]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-sm text-[#64748B]">
          Loading order management data...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && visibleOrders.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold text-[#334155]">
            No {activeTab} orders right now
          </h3>
          <p className="text-sm text-[#64748B] mt-2">
            Orders in this stage will appear here automatically.
          </p>
        </div>
      ) : null}

      {!loading && !error && visibleOrders.length > 0 ? (
        <div className="grid gap-4">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#334155]">
                      {order.order_number}
                    </h3>

                    <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
                      Order: {order.status}
                    </span>

                    <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                      Assignment: {order.vendor_assignment_status}
                    </span>
                  </div>

                  <p className="text-sm text-[#334155]">
                    <span className="font-medium">Customer:</span> {order.customer_name}
                  </p>

                  <p className="text-sm text-[#64748B]">
                    {order.city}, {order.state} {order.pincode}
                  </p>

                  <p className="text-sm text-[#64748B]">
                    <span className="font-medium text-[#334155]">Order Total:</span>{' '}
                    ₹{Number(order.grand_total || 0).toFixed(2)}
                  </p>

                  <p className="text-sm text-[#64748B]">
                    <span className="font-medium text-[#334155]">Distance:</span>{' '}
                    {order.assignment?.distance_km ?? 0} km
                  </p>

                  <p className="text-xs text-[#94A3B8]">
                    Created: {order.created_at || '—'}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[260px]">
                  <Link
                    to={`/incoming-orders/${order.id}`}
                    className="w-full text-center rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                  >
                    View Details
                  </Link>

                  {activeTab === 'accepted' ? (
                    <button
                      onClick={() => handleMarkProcessing(order.id)}
                      disabled={actionLoadingId === order.id}
                      className="w-full rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                    >
                      {actionLoadingId === order.id ? 'Please wait...' : 'Mark Processing'}
                    </button>
                  ) : null}

                  {activeTab === 'processing' ? (
                    <button
                      onClick={() => handleMarkDispatched(order.id)}
                      disabled={actionLoadingId === order.id}
                      className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                    >
                      {actionLoadingId === order.id ? 'Please wait...' : 'Mark Dispatched'}
                    </button>
                  ) : null}

                  {activeTab === 'dispatched' ? (
                    <div className="w-full rounded-xl bg-[#F1F5F9] px-4 py-3 text-center text-sm font-semibold text-[#475569]">
                      Already Dispatched
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </VendorAppLayout>
  )
}

export default OrderManagement