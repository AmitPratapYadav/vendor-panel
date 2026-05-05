import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  CircleDot,
  PackageCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import VendorAppLayout from '../components/VendorAppLayout'
import { fetchVendorDashboard } from '../services/vendorPortal'

const piePalette = ['#F59E0B', '#0F766E', '#2563EB']

const rangeOptions = [
  { key: 'day', label: 'Today' },
  { key: 'week', label: '7 Days' },
  { key: 'month', label: 'This Month' },
]

function Dashboard() {
  const [range, setRange] = useState('month')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetchVendorDashboard(range)
        setData(response)
      } catch (err) {
        setError(err.message || 'Unable to load vendor dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [range])

  const trendMax = useMemo(() => {
    const counts = (data?.order_received_trend || []).map((item) => item.count)
    return counts.length ? Math.max(...counts, 1) : 1
  }, [data])

  const pieTotal = useMemo(() => {
    return (data?.order_status_pie || []).reduce((sum, item) => sum + item.count, 0)
  }, [data])

  const pieBackground = useMemo(() => {
    if (!pieTotal) return '#E2E8F0'

    let cursor = 0

    const segments = (data?.order_status_pie || []).map((item, index) => {
      const start = cursor
      const delta = (item.count / pieTotal) * 360
      cursor += delta
      return `${piePalette[index % piePalette.length]} ${start}deg ${cursor}deg`
    })

    return `conic-gradient(${segments.join(', ')})`
  }, [data, pieTotal])

  return (
    <VendorAppLayout
      title="Dashboard"
      subtitle="Track live order flow, delivery progress, and how many jobs are reaching your panel."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
            {rangeOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  range === option.key
                    ? 'bg-[#0F766E] text-white'
                    : 'text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#64748B] shadow-sm">
            <ChevronDown size={16} />
            Live vendor analytics
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#64748B]">
            Loading dashboard...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(data?.cards || []).map((card, index) => {
                const isPositive = Number(card.growth_percentage || 0) >= 0
                const Icon = index === 0 ? BarChart3 : index === 1 ? CircleDot : index === 2 ? PackageCheck : BarChart3

                return (
                  <div key={card.key} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E]">
                        <Icon size={22} />
                      </div>

                      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {`${Number(card.growth_percentage || 0) > 0 ? '+' : ''}${Number(card.growth_percentage || 0).toFixed(1)}%`}
                      </div>
                    </div>

                    <p className="mt-5 text-sm text-[#64748B]">{card.label}</p>
                    <p className="mt-2 text-4xl font-bold text-[#334155]">{card.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#334155]">Orders Received Graph</h2>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Orders reaching your panel in the selected time window.
                    </p>
                  </div>

                  <div className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#64748B]">
                    Real-time
                  </div>
                </div>

                {(data?.order_received_trend || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center text-sm text-[#64748B]">
                    No order activity found for this filter.
                  </div>
                ) : (
                  <div className="flex h-[280px] items-end gap-2 overflow-x-auto">
                    {(data?.order_received_trend || []).map((item) => {
                      const height = Math.max((item.count / trendMax) * 220, item.count > 0 ? 24 : 8)

                      return (
                        <div key={item.label} className="flex min-w-[42px] flex-1 flex-col items-center gap-3">
                          <div className="text-xs font-semibold text-[#334155]">{item.count}</div>
                          <div className="flex h-[220px] items-end">
                            <div
                              className="w-8 rounded-t-2xl bg-gradient-to-t from-[#0F766E] to-[#5EEAD4]"
                              style={{ height: `${height}px` }}
                            />
                          </div>
                          <div className="text-center text-[11px] text-[#64748B]">{item.label}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-[#334155]">Order Status Distribution</h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Current split of pending, processing, and dispatched orders.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-full" style={{ background: pieBackground }}>
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                      <p className="text-xs text-[#64748B]">Tracked</p>
                      <p className="text-3xl font-bold text-[#334155]">{pieTotal}</p>
                    </div>
                  </div>

                  <div className="mt-6 w-full space-y-3">
                    {(data?.order_status_pie || []).map((item, index) => (
                      <div key={item.status} className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: piePalette[index % piePalette.length] }}
                          />
                          <span className="text-sm font-medium text-[#334155]">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#334155]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </VendorAppLayout>
  )
}

export default Dashboard
