import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import VendorAppLayout from '../components/VendorAppLayout'
import {
  fetchVendorOrders,
  markVendorOrderDispatched,
  markVendorOrderProcessing,
} from '../services/vendorOrders'

function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [summary, setSummary] = useState({ pending: 0, processing: 0, dispatched: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [periodType, setPeriodType] = useState('month')
  const [periodValue, setPeriodValue] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    if (periodType === 'day') {
      setPeriodValue(new Date().toISOString().slice(0, 10))
      return
    }

    if (periodType === 'month') {
      setPeriodValue(new Date().toISOString().slice(0, 7))
      return
    }

    setPeriodValue(String(new Date().getFullYear()))
  }, [periodType])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchVendorOrders({
        search,
        order_status: status || undefined,
        period_type: periodType,
        period_value: periodValue,
        per_page: 100,
      })

      setOrders(data?.data || [])
      setSummary(data?.summary || { pending: 0, processing: 0, dispatched: 0 })
    } catch (err) {
      setError(err.message || 'Unable to load order management data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [search, status, periodType, periodValue])

  const stats = useMemo(() => ([
    { label: 'Pending', value: summary.pending },
    { label: 'Processing', value: summary.processing },
    { label: 'Dispatched', value: summary.dispatched },
    { label: 'Visible Orders', value: orders.length },
  ]), [orders.length, summary])

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

  const renderPeriodInput = () => {
    if (periodType === 'day') {
      return (
        <input
          type="date"
          value={periodValue}
          onChange={(event) => setPeriodValue(event.target.value)}
          className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
        />
      )
    }

    if (periodType === 'month') {
      return (
        <input
          type="month"
          value={periodValue}
          onChange={(event) => setPeriodValue(event.target.value)}
          className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
        />
      )
    }

    return (
      <input
        type="number"
        min="2024"
        max="2100"
        value={periodValue}
        onChange={(event) => setPeriodValue(event.target.value)}
        className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
      />
    )
  }

  return (
    <VendorAppLayout
      title="Order Management"
      subtitle="Manage every assigned order with stage filters, date filters, and production actions."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#64748B]">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-[#334155]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_1fr_auto]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by order number, customer or city..."
                className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 pl-9 pr-4 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
            </select>

            <select
              value={periodType}
              onChange={(event) => setPeriodType(event.target.value)}
              className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
            >
              <option value="day">Day-wise</option>
              <option value="month">Month-wise</option>
              <option value="year">Year-wise</option>
            </select>

            {renderPeriodInput()}

            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                setSearch('')
                setStatus('')
                setPeriodType('month')
              }}
              className="rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#64748B]">
            Loading orders...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <tr className="text-left text-xs uppercase tracking-wider text-[#64748B]">
                      <th className="px-5 py-4">Order</th>
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-5 py-4">Items</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Total</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-5 py-12 text-center text-sm text-[#64748B]">
                          No orders found for the selected filters.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="text-sm text-[#334155]">
                          <td className="px-5 py-4">
                            <p className="font-semibold">{order.order_number}</p>
                            <p className="mt-1 text-xs text-[#64748B]">{order.created_at || '-'}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p>{order.customer_name}</p>
                            <p className="mt-1 text-xs text-[#64748B]">{order.customer_phone || '-'}</p>
                          </td>
                          <td className="px-5 py-4">{order.items_count || 0}</td>
                          <td className="px-5 py-4">{order.city}, {order.state}</td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#475569]">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold">Rs {Number(order.grand_total || 0).toFixed(2)}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                to={`/orders/${order.id}`}
                                className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                              >
                                View
                              </Link>

                              {order.vendor_assignment_status === 'accepted' && order.status === 'pending' ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkProcessing(order.id)}
                                  disabled={actionLoadingId === order.id}
                                  className="rounded-lg bg-[#0F766E] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                                >
                                  {actionLoadingId === order.id ? 'Please wait...' : 'Mark Processing'}
                                </button>
                              ) : null}

                              {order.vendor_assignment_status === 'accepted' && order.status === 'processing' ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkDispatched(order.id)}
                                  disabled={actionLoadingId === order.id}
                                  className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                                >
                                  {actionLoadingId === order.id ? 'Please wait...' : 'Mark Dispatched'}
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 lg:hidden">
              {orders.length === 0 ? (
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center text-sm text-[#64748B]">
                  No orders found for the selected filters.
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-[#334155]">{order.order_number}</p>
                        <p className="mt-1 text-sm text-[#64748B]">{order.customer_name}</p>
                      </div>
                      <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#475569]">
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-[#64748B]">
                      <p>{order.city}, {order.state}</p>
                      <p>Items: {order.items_count || 0}</p>
                      <p>Total: Rs {Number(order.grand_total || 0).toFixed(2)}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="rounded-xl border border-[#CBD5E1] px-4 py-3 text-center text-sm font-semibold text-[#334155]"
                      >
                        View Details
                      </Link>

                      {order.vendor_assignment_status === 'accepted' && order.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => handleMarkProcessing(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          {actionLoadingId === order.id ? 'Please wait...' : 'Mark Processing'}
                        </button>
                      ) : null}

                      {order.vendor_assignment_status === 'accepted' && order.status === 'processing' ? (
                        <button
                          type="button"
                          onClick={() => handleMarkDispatched(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          {actionLoadingId === order.id ? 'Please wait...' : 'Mark Dispatched'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
    </VendorAppLayout>
  )
}

export default OrderManagement
