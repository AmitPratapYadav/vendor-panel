import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, List, Search } from 'lucide-react'
import VendorAppLayout from '../components/VendorAppLayout'
import { fetchVendorProducts, syncVendorProductCatalog } from '../services/vendorPortal'

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [summary, setSummary] = useState({ total_products: 0, catalog_products: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [catalogStatus, setCatalogStatus] = useState('all')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchVendorProducts({
        search,
        category_id: categoryId || undefined,
        catalog_status: catalogStatus,
        per_page: 100,
      })

      setProducts(data?.data || [])
      setCategories(data?.categories || [])
      setSummary(data?.summary || { total_products: 0, catalog_products: 0 })
    } catch (err) {
      setError(err.message || 'Unable to load vendor products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [search, categoryId, catalogStatus])

  const stats = useMemo(() => ([
    { label: 'Active Products', value: summary.total_products },
    { label: 'In My Catalog', value: summary.catalog_products },
    { label: 'Available To Add', value: Math.max((summary.total_products || 0) - (summary.catalog_products || 0), 0) },
  ]), [summary])

  const handleQuickToggle = async (product) => {
    try {
      setActionLoadingId(product.id)
      await syncVendorProductCatalog(product.id, {
        is_listed: !product.catalog?.is_listed,
        production_capacity_per_day: product.catalog?.is_listed
          ? null
          : Math.max(product.catalog?.production_capacity_per_day || 100, 1),
        notes: product.catalog?.notes || '',
      })
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Unable to update catalog status.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <VendorAppLayout
      title="Product Management"
      subtitle="Control which products you can produce and set live production capacity per product."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#64748B]">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-[#334155]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products by name or slug..."
                className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 pl-9 pr-4 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
              />
            </div>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <select
              value={catalogStatus}
              onChange={(event) => setCatalogStatus(event.target.value)}
              className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#9BCBBF]"
            >
              <option value="all">All Products</option>
              <option value="in_catalog">In My Catalog</option>
              <option value="not_in_catalog">Not In My Catalog</option>
            </select>

            <div className="inline-flex rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-lg px-3 py-2 ${viewMode === 'list' ? 'bg-white text-[#334155] shadow-sm' : 'text-[#64748B]'}`}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-lg px-3 py-2 ${viewMode === 'grid' ? 'bg-white text-[#334155] shadow-sm' : 'text-[#64748B]'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#64748B]">
            Loading products...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center text-sm text-[#64748B]">
            No products found for the selected filters.
          </div>
        ) : null}

        {!loading && !error && products.length > 0 && viewMode === 'list' ? (
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <tr className="text-left text-xs uppercase tracking-wider text-[#64748B]">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Starting Price</th>
                    <th className="px-5 py-4">Capacity / Day</th>
                    <th className="px-5 py-4">Catalog</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {products.map((product) => (
                    <tr key={product.id} className="text-sm text-[#334155]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                            {product.hero_image_url ? (
                              <img src={product.hero_image_url} alt={product.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="mt-1 text-xs text-[#64748B]">{product.short_description || product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">{product.category_name}{product.subcategory_name ? ` / ${product.subcategory_name}` : ''}</td>
                      <td className="px-5 py-4 font-semibold">Rs {Number(product.starting_price || 0).toFixed(2)}</td>
                      <td className="px-5 py-4">{product.catalog?.production_capacity_per_day || '-'}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.catalog?.is_listed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {product.catalog?.is_listed ? 'In Catalog' : 'Not Added'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/product-management/${product.id}`}
                            className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                          >
                            View Details
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleQuickToggle(product)}
                            disabled={actionLoadingId === product.id}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-60 ${
                              product.catalog?.is_listed ? 'bg-[#334155]' : 'bg-[#0F766E]'
                            }`}
                          >
                            {actionLoadingId === product.id
                              ? 'Please wait...'
                              : product.catalog?.is_listed
                              ? 'Remove'
                              : 'Add'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!loading && !error && products.length > 0 && viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="h-44 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  {product.hero_image_url ? (
                    <img src={product.hero_image_url} alt={product.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="mt-4">
                  <p className="text-lg font-semibold text-[#334155]">{product.name}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{product.category_name}{product.subcategory_name ? ` / ${product.subcategory_name}` : ''}</p>
                  <p className="mt-3 text-sm text-[#475569]">Starting at Rs {Number(product.starting_price || 0).toFixed(2)}</p>
                  <p className="mt-2 text-sm text-[#475569]">Capacity / day: {product.catalog?.production_capacity_per_day || '-'}</p>
                </div>

                <div className="mt-5 flex gap-2">
                  <Link
                    to={`/product-management/${product.id}`}
                    className="flex-1 rounded-xl border border-[#CBD5E1] px-4 py-3 text-center text-sm font-semibold text-[#334155]"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleQuickToggle(product)}
                    disabled={actionLoadingId === product.id}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 ${
                      product.catalog?.is_listed ? 'bg-[#334155]' : 'bg-[#0F766E]'
                    }`}
                  >
                    {actionLoadingId === product.id
                      ? 'Please wait...'
                      : product.catalog?.is_listed
                      ? 'Remove'
                      : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </VendorAppLayout>
  )
}

export default ProductManagement
