import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'

const VendorAuthContext = createContext(null)

export function VendorAuthProvider({ children }) {
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('vendor_token')

    if (!token) {
      setLoading(false)
      return
    }

    apiRequest('/vendor/me')
      .then((data) => {
        setVendor(data.vendor || null)
      })
      .catch(() => {
        localStorage.removeItem('vendor_token')
        setVendor(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (loginValue, password) => {
    const data = await apiRequest('/vendor/login', {
      method: 'POST',
      body: JSON.stringify({
        login: loginValue,
        password,
      }),
    })

    localStorage.setItem('vendor_token', data.token)
    setVendor(data.vendor || null)

    return data
  }

  const logout = async () => {
    try {
      await apiRequest('/vendor/logout', {
        method: 'POST',
      })
    } catch {
      // ignore
    }

    localStorage.removeItem('vendor_token')
    setVendor(null)
  }

  const refreshVendor = async () => {
    const data = await apiRequest('/vendor/me')
    setVendor(data.vendor || null)
    return data.vendor
  }

  const value = useMemo(() => ({
    vendor,
    setVendor,
    loading,
    isAuthenticated: !!vendor,
    login,
    logout,
    refreshVendor,
  }), [vendor, loading])

  return (
    <VendorAuthContext.Provider value={value}>
      {children}
    </VendorAuthContext.Provider>
  )
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext)

  if (!context) {
    throw new Error('useVendorAuth must be used inside VendorAuthProvider')
  }

  return context
}