import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useVendorAuth } from '../context/VendorAuthContext'
import { searchVendorOrders } from '../services/vendorPortal'

function TopBar({ onMenuClick }) {
  const { vendor } = useVendorAuth()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const initials = useMemo(() => {
    const source = vendor?.business_name || 'Vendor'
    return source
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'VP'
  }, [vendor?.business_name])

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < 2) {
      setResults([])
      setError('')
      setLoading(false)
      return undefined
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await searchVendorOrders(trimmed)
        setResults(data?.results || [])
      } catch (searchError) {
        setError(searchError.message || 'Search failed.')
      } finally {
        setLoading(false)
      }
    }, 220)

    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([])
        setError('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectResult = (path) => {
    navigate(path)
    setQuery('')
    setResults([])
    setError('')
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition-all duration-200 hover:bg-[#9BCBBF] lg:hidden"
        >
          <Menu size={24} className="text-[#334155]" />
        </button>

        <div>
          <h2 className="text-xl font-semibold text-[#334155]">
            Welcome back, {vendor?.business_name || 'Vendor'}
          </h2>
          <p className="text-sm text-[#64748B]">
            Manage incoming jobs, catalog availability, and production updates.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 focus-within:border-[#9BCBBF] md:w-[320px]">
            <Search size={18} className="text-[#94A3B8]" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders..."
              className="w-full bg-transparent text-sm text-[#334155] outline-none"
            />
          </div>

          {(loading || error || results.length > 0) ? (
            <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
              {loading ? <div className="px-4 py-3 text-sm text-[#64748B]">Searching...</div> : null}
              {!loading && error ? <div className="px-4 py-3 text-sm text-red-600">{error}</div> : null}
              {!loading && !error && results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#64748B]">No matching orders found.</div>
              ) : null}
              {!loading && !error && results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSelectResult(result.path)}
                      className="w-full border-b border-[#F1F5F9] px-4 py-3 text-left last:border-b-0 hover:bg-[#F8FAFC]"
                    >
                      <p className="text-sm font-semibold text-[#334155]">{result.title}</p>
                      <p className="mt-1 text-xs text-[#64748B]">{result.subtitle}</p>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <button className="rounded-xl p-2 transition-all duration-200 hover:bg-[#F1F5F9]">
          <Bell size={20} className="text-[#64748B]" />
        </button>

        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#9BCBBF] text-sm font-semibold text-[#1E293B] md:flex">
          {initials}
        </div>
      </div>
    </div>
  )
}

export default TopBar
