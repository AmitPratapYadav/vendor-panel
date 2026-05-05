import { useEffect, useRef, useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchVendorOrders } from '../services/vendorPortal'

function MobileHeader({ onMenuClick }) {
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSelect = (path) => {
    navigate(path)
    setQuery('')
    setResults([])
    setError('')
  }

  return (
    <div className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-[#9BCBBF]"
        >
          <Menu size={22} className="text-[#334155]" />
        </button>

        <h1 className="text-base font-semibold text-[#334155]">Vendor Portal</h1>

        <button className="rounded-lg p-2 transition hover:bg-[#F1F5F9]">
          <Bell size={20} className="text-[#334155]" />
        </button>
      </div>

      <div ref={searchRef} className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5">
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
          <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
            {loading ? <div className="px-4 py-3 text-sm text-[#64748B]">Searching...</div> : null}
            {!loading && error ? <div className="px-4 py-3 text-sm text-red-600">{error}</div> : null}
            {!loading && !error && results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#64748B]">No matching orders found.</div>
            ) : null}
            {!loading && !error && results.length > 0 ? (
              <div className="max-h-72 overflow-y-auto">
                {results.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSelect(result.path)}
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
    </div>
  )
}

export default MobileHeader
