import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VendorAppLayout from '../components/VendorAppLayout'
import { fetchVendorProduct, syncVendorProductCatalog } from '../services/vendorPortal'

function VendorProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState({
    is_listed: false,
    production_capacity_per_day: '',
    notes: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchVendorProduct(id)
      const nextProduct = data?.product || null
      setProduct(nextProduct)
      setForm({
        is_listed: !!nextProduct?.catalog?.is_listed,
        production_capacity_per_day: nextProduct?.catalog?.production_capacity_per_day || '',
        notes: nextProduct?.catalog?.notes || '',
      })
    } catch (err) {
      setError(err.message || 'Unable to load product details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const primaryImage = useMemo(() => {
    return product?.images?.find((image) => image.is_primary) || product?.images?.[0]
  }, [product])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = await syncVendorProductCatalog(id, {
        is_listed: form.is_listed,
        production_capacity_per_day: form.is_listed ? Number(form.production_capacity_per_day) : null,
        notes: form.notes,
      })

      setProduct(data?.product || product)
      setSuccess(data?.message || 'Catalog settings updated successfully.')
    } catch (err) {
      setError(err.message || 'Unable to update product catalog settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <VendorAppLayout
      title="Product Details"
      subtitle="Review product configuration and decide whether it should stay in your vendor catalog."
    >
      <div className="space-y-6">
        <div>
          <Link to="/product-management" className="text-sm font-medium text-[#0F766E] hover:underline">
            Back to Product Management
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#64748B]">
            Loading product details...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        {!loading && !error && product ? (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
                    {primaryImage?.image_url ? (
                      <img src={primaryImage.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
                      {product.category_name}{product.subcategory_name ? ` / ${product.subcategory_name}` : ''}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-[#334155]">{product.name}</h2>
                    <p className="mt-3 text-sm text-[#64748B]">{product.short_description || product.description || 'No description added yet.'}</p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <p className="text-sm text-[#64748B]">Starting Price</p>
                        <p className="mt-2 text-2xl font-bold text-[#334155]">Rs {Number(product.starting_price || 0).toFixed(2)}</p>
                      </div>
                      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <p className="text-sm text-[#64748B]">Catalog Status</p>
                        <p className="mt-2 text-2xl font-bold text-[#334155]">{product.catalog?.is_listed ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#334155]">Quantity Brackets</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {(product.quantity_prices || []).map((price) => (
                    <div key={price.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-sm text-[#64748B]">Quantity</p>
                      <p className="mt-2 text-xl font-bold text-[#334155]">{price.quantity}</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F766E]">Rs {Number(price.price || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#334155]">Variant Options</h3>
                <div className="mt-4 space-y-4">
                  {(product.option_groups || []).map((group) => (
                    <div key={group.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-sm font-semibold text-[#334155]">{group.name}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(group.values || []).map((value) => (
                          <span key={value.id} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#475569]">
                            {value.label} (+ Rs {Number(value.price_modifier || 0).toFixed(2)})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#334155]">Catalog Control</h3>
                <p className="mt-1 text-sm text-[#64748B]">
                  Enable this product if your vendor unit can produce it. Future allocation can depend on this setting.
                </p>

                <div className="mt-5 space-y-4">
                  <label className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#334155]">Add to My Catalog</p>
                      <p className="mt-1 text-xs text-[#64748B]">Turn this on only if your team can fulfill this product.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.is_listed}
                      onChange={(event) => setForm((prev) => ({ ...prev, is_listed: event.target.checked }))}
                      className="h-5 w-5 rounded border-[#CBD5E1]"
                    />
                  </label>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">Production Capacity Per Day</label>
                    <input
                      type="number"
                      min="1"
                      value={form.production_capacity_per_day}
                      onChange={(event) => setForm((prev) => ({ ...prev, production_capacity_per_day: event.target.value }))}
                      className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
                      placeholder="Example: 500"
                      disabled={!form.is_listed}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">Notes</label>
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                      className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
                      placeholder="Optional production notes, machine constraints, or quality remarks."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Catalog Settings'}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#334155]">Current Status</h3>
                <div className="mt-4 space-y-3 text-sm text-[#475569]">
                  <p><span className="font-medium text-[#334155]">Listed:</span> {product.catalog?.is_listed ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium text-[#334155]">Capacity / Day:</span> {product.catalog?.production_capacity_per_day || '-'}</p>
                  <p><span className="font-medium text-[#334155]">Last Enabled:</span> {product.catalog?.last_enabled_at || '-'}</p>
                </div>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </VendorAppLayout>
  )
}

export default VendorProductDetails
