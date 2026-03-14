import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useVendorAuth } from '../context/VendorAuthContext'

function Login() {
  const { login, isAuthenticated } = useVendorAuth()

  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(loginValue, password)
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Ziva Print" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#334155]">Vendor Login</h1>
          <p className="text-sm text-[#64748B] mt-2">
            Sign in to manage assigned orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">
              Email / Phone / Vendor ID
            </label>
            <input
              type="text"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="Enter email, phone or vendor code"
              className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1E293B] hover:opacity-95 text-white py-3 rounded-xl font-semibold transition duration-200 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login