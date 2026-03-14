import VendorAppLayout from '../components/VendorAppLayout'
import { useVendorAuth } from '../context/VendorAuthContext'

function ApexProfile() {
  const { vendor } = useVendorAuth()

  return (
    <VendorAppLayout
      title="Vendor Profile"
      subtitle="Your account summary and live business information."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#9BCBBF] flex items-center justify-center text-[#1E293B] text-xl font-bold">
              {(vendor?.business_name || 'V').charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#334155]">
                {vendor?.business_name || 'Vendor'}
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                {vendor?.vendor_code || '—'}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-[#475569]">
            <p><span className="font-medium text-[#334155]">Contact Person:</span> {vendor?.contact_person_name || '—'}</p>
            <p><span className="font-medium text-[#334155]">Email:</span> {vendor?.email || '—'}</p>
            <p><span className="font-medium text-[#334155]">Phone:</span> {vendor?.phone || '—'}</p>
            <p><span className="font-medium text-[#334155]">Approval Status:</span> {vendor?.approval_status || '—'}</p>
            <p>
              <span className="font-medium text-[#334155]">Live Status:</span>{' '}
              <span className={vendor?.is_online ? 'text-emerald-600' : 'text-red-600'}>
                {vendor?.is_online ? 'Online' : 'Offline'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#334155]">Location & Serviceability</h3>

          <div className="mt-4 space-y-3 text-sm text-[#475569]">
            <p><span className="font-medium text-[#334155]">Zone:</span> {vendor?.zone_name || '—'}</p>
            <p><span className="font-medium text-[#334155]">City:</span> {vendor?.city_name || '—'}</p>
            <p><span className="font-medium text-[#334155]">Area:</span> {vendor?.area_name || '—'}</p>
            <p><span className="font-medium text-[#334155]">Pincode:</span> {vendor?.pincode || '—'}</p>
            <p><span className="font-medium text-[#334155]">Service Radius:</span> {vendor?.service_radius_km || 0} KM</p>
            <p><span className="font-medium text-[#334155]">Latitude:</span> {vendor?.latitude || '—'}</p>
            <p><span className="font-medium text-[#334155]">Longitude:</span> {vendor?.longitude || '—'}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-[#334155]">Formatted Address</h3>
          <p className="mt-3 text-sm text-[#475569]">
            {vendor?.formatted_address || 'No formatted address available.'}
          </p>
        </div>
      </div>
    </VendorAppLayout>
  )
}

export default ApexProfile