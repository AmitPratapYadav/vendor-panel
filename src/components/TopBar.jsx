import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useVendorAuth } from '../context/VendorAuthContext'
import { fetchVendorNotifications, markVendorNotificationRead, searchVendorOrders } from '../services/vendorPortal'

function TopBar({ onMenuClick }) {
  const { vendor } = useVendorAuth()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const notificationRef = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationLoading, setNotificationLoading] = useState(false)

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

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    let mounted = true

    const loadNotifications = async () => {
      try {
        setNotificationLoading(true)
        const data = await fetchVendorNotifications()
        if (!mounted) return
        setNotifications(data?.notifications || [])
        setUnreadCount(data?.unread_count || 0)
      } catch {
        if (!mounted) return
        setNotifications([])
        setUnreadCount(0)
      } finally {
        if (mounted) setNotificationLoading(false)
      }
    }

    loadNotifications()
    const interval = window.setInterval(loadNotifications, 30000)

    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [])

  const handleSelectResult = (path) => {
    navigate(path)
    setQuery('')
    setResults([])
    setError('')
  }

  const handleNotificationSelect = async (notification) => {
    try {
      if (!notification.is_read) {
        await markVendorNotificationRead(notification.id)
        setNotifications((current) => current.map((item) => (
          item.id === notification.id ? { ...item, is_read: true } : item
        )))
        setUnreadCount((count) => Math.max(0, count - 1))
      }
    } catch {
      // ignore read failures during navigation
    }

    setNotificationOpen(false)
    if (notification.path) {
      navigate(notification.path)
    }
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

        <div
          ref={notificationRef}
          className="relative"
          onMouseEnter={() => setNotificationOpen(true)}
          onMouseLeave={() => setNotificationOpen(false)}
        >
          <button className="relative rounded-xl p-2 transition-all duration-200 hover:bg-[#F1F5F9]" onClick={() => setNotificationOpen((value) => !value)}>
            <Bell size={20} className={unreadCount > 0 ? 'text-red-500 animate-pulse' : 'text-[#64748B]'} />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
            ) : null}
          </button>

          {notificationOpen ? (
            <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
              <div className="border-b border-[#E2E8F0] px-4 py-3">
                <p className="text-sm font-semibold text-[#334155]">Notifications</p>
                <p className="text-xs text-[#64748B]">{unreadCount} unread</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notificationLoading ? <div className="px-4 py-3 text-sm text-[#64748B]">Loading notifications...</div> : null}
                {!notificationLoading && notifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#64748B]">No new notifications.</div>
                ) : null}
                {!notificationLoading && notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationSelect(notification)}
                    className={`w-full border-b border-[#F1F5F9] px-4 py-3 text-left last:border-b-0 hover:bg-[#F8FAFC] ${
                      notification.is_read ? 'bg-white' : 'bg-red-50/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#334155]">{notification.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{notification.message || 'Open to view details.'}</p>
                    <p className="mt-2 text-[11px] text-[#94A3B8]">
                      {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#9BCBBF] text-sm font-semibold text-[#1E293B] md:flex">
          {initials}
        </div>
      </div>
    </div>
  )
}

export default TopBar
