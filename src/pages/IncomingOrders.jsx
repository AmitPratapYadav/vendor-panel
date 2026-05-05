import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import VendorAppLayout from '../components/VendorAppLayout'
import { acceptVendorOrder, fetchVendorOrders, rejectVendorOrder } from '../services/vendorOrders'

function IncomingOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [rejectingOrderId, setRejectingOrderId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.vendor_assignment_status === 'pending'),
    [orders]
  )

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchVendorOrders({ assignment_status: 'pending', per_page: 100 })
      setOrders(data?.data || [])
    } catch (err) {
      setError(err.message || 'Unable to load incoming orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleAccept = async (orderId) => {
    try {
      setActionLoadingId(orderId)
      await acceptVendorOrder(orderId)
      await loadOrders()
    } catch (err) {
      alert(err.message || 'Unable to accept order.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (orderId) => {
    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason.')
      return
    }

    try {
      setActionLoadingId(orderId)
      await rejectVendorOrder(orderId, rejectReason.trim())
      setRejectingOrderId(null)
      setRejectReason('')
      await loadOrders()
    } catch (err) {
      alert(err.message || 'Unable to reject order.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <VendorAppLayout
      title="Incoming Orders"
      subtitle="Review newly assigned jobs, accept them quickly, or decline with a clear reason."
    >
      {loading ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#64748B]">
          Loading incoming orders...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && pendingOrders.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-[#334155]">No incoming orders right now</h3>
          <p className="mt-2 text-sm text-[#64748B]">New auto-assigned jobs will appear here.</p>
        </div>
      ) : null}

      {!loading && !error && pendingOrders.length > 0 ? (
        <div className="grid gap-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#334155]">{order.order_number}</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Pending Response
                    </span>
                  </div>

                  <p className="text-sm text-[#334155]"><span className="font-medium">Customer:</span> {order.customer_name}</p>
                  <p className="text-sm text-[#64748B]">{order.city}, {order.state} {order.pincode}</p>
                  <p className="text-sm text-[#64748B]"><span className="font-medium text-[#334155]">Distance:</span> {order.assignment?.distance_km ?? 0} km</p>
                  <p className="text-sm text-[#64748B]"><span className="font-medium text-[#334155]">Order Total:</span> Rs {Number(order.grand_total || 0).toFixed(2)}</p>
                  <p className="text-xs text-[#94A3B8]">Assigned at: {order.assignment?.assigned_at || '-'}</p>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[280px]">
                  <Link
                    to={`/orders/${order.id}`}
                    className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-center text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleAccept(order.id)}
                    disabled={actionLoadingId === order.id}
                    className="w-full rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {actionLoadingId === order.id ? 'Please wait...' : 'Accept Order'}
                  </button>

                  {rejectingOrderId === order.id ? (
                    <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <textarea
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        placeholder="Enter rejection reason"
                        rows={3}
                        className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm outline-none focus:border-[#9BCBBF]"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="flex-1 rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          Submit Reject
                        </button>

                        <button
                          onClick={() => {
                            setRejectingOrderId(null)
                            setRejectReason('')
                          }}
                          className="flex-1 rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setRejectingOrderId(order.id)
                        setRejectReason('')
                      }}
                      className="w-full rounded-xl bg-[#DC2626] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Reject Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </VendorAppLayout>
  )
}

export default IncomingOrders
