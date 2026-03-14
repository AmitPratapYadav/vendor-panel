import { useEffect, useMemo, useState } from 'react'
import VendorAppLayout from '../components/VendorAppLayout'
import { useVendorAuth } from '../context/VendorAuthContext'
import {
  fetchVendorProfile,
  updateVendorProfile,
  toggleVendorOnline,
  fetchCities,
  fetchZones,
} from '../services/vendorOrders'

function ProfileKYC() {
  const { setVendor, refreshVendor } = useVendorAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [zones, setZones] = useState([])
  const [cities, setCities] = useState([])

  const [form, setForm] = useState({
    business_name: '',
    contact_person_name: '',
    email: '',
    phone: '',
    city_id: '',
    address_line_1: '',
    address_line_2: '',
    area_name: '',
    pincode: '',
    formatted_address: '',
    google_place_id: '',
    latitude: '',
    longitude: '',
    service_radius_km: 5,
    is_online: false,
    zone_name: '',
    city_name: '',
  })

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        setError('')

        const [profileData, zonesData, citiesData] = await Promise.all([
          fetchVendorProfile(),
          fetchZones(),
          fetchCities(),
        ])

        const vendor = profileData.vendor
        const zonesList = zonesData.zones || []
        const citiesList = citiesData.cities || []

        setZones(zonesList)
        setCities(citiesList)

        setForm({
          business_name: vendor?.business_name || '',
          contact_person_name: vendor?.contact_person_name || '',
          email: vendor?.email || '',
          phone: vendor?.phone || '',
          city_id: vendor?.city_id || '',
          address_line_1: vendor?.address_line_1 || '',
          address_line_2: vendor?.address_line_2 || '',
          area_name: vendor?.area_name || '',
          pincode: vendor?.pincode || '',
          formatted_address: vendor?.formatted_address || '',
          google_place_id: vendor?.google_place_id || '',
          latitude: vendor?.latitude || '',
          longitude: vendor?.longitude || '',
          service_radius_km: vendor?.service_radius_km || 5,
          is_online: !!vendor?.is_online,
          zone_name: vendor?.zone_name || '',
          city_name: vendor?.city_name || '',
        })
      } catch (err) {
        setError(err.message || 'Unable to load vendor profile.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const selectedCity = useMemo(() => {
    return cities.find((city) => Number(city.id) === Number(form.city_id))
  }, [cities, form.city_id])

  useEffect(() => {
    if (selectedCity) {
      const matchingZone = zones.find((zone) => Number(zone.id) === Number(selectedCity.zone_id))
      setForm((prev) => ({
        ...prev,
        zone_name: matchingZone?.name || prev.zone_name,
        city_name: selectedCity.name || prev.city_name,
      }))
    }
  }, [selectedCity, zones])

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const payload = {
        business_name: form.business_name,
        contact_person_name: form.contact_person_name,
        email: form.email,
        phone: form.phone,
        city_id: form.city_id ? Number(form.city_id) : null,
        address_line_1: form.address_line_1,
        address_line_2: form.address_line_2,
        area_name: form.area_name,
        pincode: form.pincode,
        formatted_address: form.formatted_address,
        google_place_id: form.google_place_id,
        latitude: form.latitude === '' ? null : Number(form.latitude),
        longitude: form.longitude === '' ? null : Number(form.longitude),
        service_radius_km: Number(form.service_radius_km || 0),
      }

      const data = await updateVendorProfile(payload)

      setVendor(data.vendor || null)
      await refreshVendor()
      setSuccess(data.message || 'Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleOnline = async () => {
    try {
      setToggleLoading(true)
      setError('')
      setSuccess('')

      const data = await toggleVendorOnline(!form.is_online)

      updateField('is_online', !!data.vendor?.is_online)
      setVendor(data.vendor || null)
      await refreshVendor()

      setSuccess(data.message || 'Online status updated.')
    } catch (err) {
      setError(err.message || 'Unable to update online status.')
    } finally {
      setToggleLoading(false)
    }
  }

  return (
    <VendorAppLayout
      title="Profile & KYC"
      subtitle="Manage your business profile, service area, and live order availability."
    >
      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-sm text-[#64748B]">
          Loading vendor profile...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && success ? (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      {!loading ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-[#334155]">Business Details</h2>
              <p className="text-sm text-[#64748B] mt-1">
                Keep your vendor identity and service information updated.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) => updateField('business_name', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={form.contact_person_name}
                  onChange={(e) => updateField('contact_person_name', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  City
                </label>
                <select
                  value={form.city_id}
                  onChange={(e) => updateField('city_id', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#9BCBBF]"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} {city.state_name ? `(${city.state_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Zone
                </label>
                <input
                  type="text"
                  value={form.zone_name}
                  readOnly
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={form.address_line_1}
                  onChange={(e) => updateField('address_line_1', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={form.address_line_2}
                  onChange={(e) => updateField('address_line_2', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Area Name
                </label>
                <input
                  type="text"
                  value={form.area_name}
                  onChange={(e) => updateField('area_name', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Service Radius (KM)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.service_radius_km}
                  onChange={(e) => updateField('service_radius_km', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Formatted Address
              </label>
              <textarea
                rows={3}
                value={form.formatted_address}
                onChange={(e) => updateField('formatted_address', e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  value={form.latitude}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  value={form.longitude}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Google Place ID
                </label>
                <input
                  type="text"
                  value={form.google_place_id}
                  onChange={(e) => updateField('google_place_id', e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm focus:outline-none focus:border-[#9BCBBF]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#334155]">Live Order Status</h2>
              <p className="text-sm text-[#64748B] mt-1">
                Control whether your panel should receive new order assignments.
              </p>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#334155]">
                    {form.is_online ? 'Online' : 'Offline'}
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">
                    {form.is_online
                      ? 'You are available for new order assignments.'
                      : 'You will not receive new assignments while offline.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleOnline}
                  disabled={toggleLoading}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                    form.is_online ? 'bg-[#DC2626]' : 'bg-[#0F766E]'
                  } disabled:opacity-60`}
                >
                  {toggleLoading
                    ? 'Please wait...'
                    : form.is_online
                    ? 'Go Offline'
                    : 'Go Online'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#334155]">Profile Summary</h2>

              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                <p><span className="font-medium text-[#334155]">City:</span> {form.city_name || '—'}</p>
                <p><span className="font-medium text-[#334155]">Zone:</span> {form.zone_name || '—'}</p>
                <p><span className="font-medium text-[#334155]">Radius:</span> {form.service_radius_km || 0} KM</p>
                <p><span className="font-medium text-[#334155]">Coordinates:</span> {form.latitude || '—'}, {form.longitude || '—'}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#334155]">KYC Status</h2>
              <p className="text-sm text-[#64748B] mt-2">
                Document upload and full KYC verification module will be connected in a later phase.
              </p>

              <div className="mt-4 inline-flex rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold">
                Basic Profile Active
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </VendorAppLayout>
  )
}

export default ProfileKYC