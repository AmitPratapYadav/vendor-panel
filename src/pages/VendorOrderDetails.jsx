import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VendorAppLayout from '../components/VendorAppLayout'
import {
  acceptVendorOrder,
  fetchVendorOrderDetails,
  markVendorOrderDispatched,
  markVendorOrderProcessing,
  rejectVendorOrder,
} from '../services/vendorOrders'

function VendorOrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchVendorOrderDetails(id)
      setOrder(data)
    } catch (err) {
      setError(err.message || 'Unable to load order details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  const handleAccept = async () => {
    try {
      setActionLoading(true)
      await acceptVendorOrder(id)
      await loadOrder()
      navigate('/order-management')
    } catch (err) {
      alert(err.message || 'Unable to accept order.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter rejection reason.')
      return
    }

    try {
      setActionLoading(true)
      await rejectVendorOrder(id, rejectReason.trim())
      await loadOrder()
      navigate('/incoming-orders')
    } catch (err) {
      alert(err.message || 'Unable to reject order.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkProcessing = async () => {
    try {
      setActionLoading(true)
      await markVendorOrderProcessing(id)
      await loadOrder()
      navigate('/order-management')
    } catch (err) {
      alert(err.message || 'Unable to mark order as processing.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkDispatched = async () => {
    try {
      setActionLoading(true)
      await markVendorOrderDispatched(id)
      await loadOrder()
      navigate('/order-management')
    } catch (err) {
      alert(err.message || 'Unable to mark order as dispatched.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <VendorAppLayout
      title="Order Details"
      subtitle="Review the full job snapshot, customer information, and update the production stage."
    >
      <div className="space-y-6">
        <div>
          <Link
            to={order?.vendor_assignment_status === 'pending' ? '/incoming-orders' : '/order-management'}
            className="text-sm font-medium text-[#0F766E] hover:underline"
          >
            Back
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#64748B]">
            Loading order details...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && order ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#334155]">{order.order_number}</h2>
                  <p className="mt-1 text-sm text-[#64748B]">Assigned at: {order.current_assignment?.assigned_at || '-'}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Assignment: {order.vendor_assignment_status}
                  </span>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Order: {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#334155]">Customer Information</h3>
                <div className="space-y-2 text-sm text-[#475569]">
                  <p><span className="font-medium text-[#334155]">Name:</span> {order.customer_name}</p>
                  <p><span className="font-medium text-[#334155]">Phone:</span> {order.customer_phone}</p>
                  <p><span className="font-medium text-[#334155]">Email:</span> {order.customer_email || '-'}</p>
                  <p><span className="font-medium text-[#334155]">Address:</span> {order.address_line_1}</p>
                  {order.address_line_2 ? <p>{order.address_line_2}</p> : null}
                  <p>{order.city}, {order.state} {order.pincode}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#334155]">Order Summary</h3>
                <div className="space-y-2 text-sm text-[#475569]">
                  <p><span className="font-medium text-[#334155]">Subtotal:</span> Rs {Number(order.subtotal || 0).toFixed(2)}</p>
                  <p><span className="font-medium text-[#334155]">Shipping:</span> Rs {Number(order.shipping_amount || 0).toFixed(2)}</p>
                  <p><span className="font-medium text-[#334155]">Tax:</span> Rs {Number(order.tax_amount || 0).toFixed(2)}</p>
                  <p className="text-base font-bold text-[#0F172A]">Grand Total: Rs {Number(order.grand_total || 0).toFixed(2)}</p>
                  <p><span className="font-medium text-[#334155]">Distance:</span> {Number(order.current_assignment?.distance_km || 0).toFixed(2)} km</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-[#334155]">Ordered Items</h3>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#E2E8F0] p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                      <div>
                        <h4 className="font-semibold text-[#334155]">{item.product_name_snapshot}</h4>
                        <p className="mt-1 text-sm text-[#64748B]">Quantity: {item.quantity}</p>
                        <p className="text-sm text-[#64748B]">Line Total: Rs {Number(item.line_total || 0).toFixed(2)}</p>
                      </div>

                      <div className="text-sm text-[#475569]">
                        <p>Base: Rs {Number(item.base_quantity_price || 0).toFixed(2)}</p>
                        <p>Modifier: Rs {Number(item.option_modifier_total || 0).toFixed(2)}</p>
                        <p>Unit: Rs {Number(item.final_unit_price || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    {item.selected_options?.length ? (
                      <div className="mt-4">
                        <h5 className="mb-2 text-sm font-semibold text-[#334155]">Selected Options</h5>
                        <div className="flex flex-wrap gap-2">
                          {item.selected_options.map((option) => (
                            <span key={option.id} className="inline-flex rounded-full bg-[#F1F5F9] px-3 py-1 text-xs text-[#475569]">
                              {option.group_name_snapshot}: {option.value_label_snapshot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {item.uploads?.length ? (
                      <div className="mt-4">
                        <h5 className="mb-2 text-sm font-semibold text-[#334155]">Design Files</h5>
                        <div className="space-y-2">
                          {item.uploads.map((upload) => (
                            <div key={upload.id} className="flex flex-col gap-2 rounded-lg border border-[#E2E8F0] p-3 lg:flex-row lg:items-center lg:justify-between">
                              <div>
                                <p className="text-sm font-medium text-[#334155]">{upload.original_name || 'Design File'}</p>
                                <p className="text-xs text-[#64748B]">{upload.file_type || 'File'}</p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {upload.file_url ? (
                                  <a href={upload.file_url} target="_blank" rel="noreferrer" className="rounded-lg bg-[#0F766E] px-3 py-2 text-xs font-semibold text-white">
                                    View File
                                  </a>
                                ) : null}
                                {upload.design_preview_url ? (
                                  <a href={upload.design_preview_url} target="_blank" rel="noreferrer" className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-semibold text-[#334155]">
                                    Preview
                                  </a>
                                ) : null}
                                {upload.render_pdf_url ? (
                                  <a href={upload.render_pdf_url} target="_blank" rel="noreferrer" className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-semibold text-[#334155]">
                                    Render PDF
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {order.vendor_assignment_status === 'pending' ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#334155]">Take Action</h3>

                <div className="mb-4 flex flex-col gap-3 lg:flex-row">
                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="flex-1 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {actionLoading ? 'Please wait...' : 'Accept Order'}
                  </button>

                  <button
                    onClick={() => setShowRejectBox((prev) => !prev)}
                    className="flex-1 rounded-xl bg-[#DC2626] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Reject Order
                  </button>
                </div>

                {showRejectBox ? (
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <textarea
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      rows={4}
                      placeholder="Enter rejection reason"
                      className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm outline-none focus:border-[#9BCBBF]"
                    />

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        Submit Reject
                      </button>

                      <button
                        onClick={() => {
                          setShowRejectBox(false)
                          setRejectReason('')
                        }}
                        className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {order.vendor_assignment_status === 'accepted' && order.status === 'pending' ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#334155]">Production Action</h3>
                <button
                  onClick={handleMarkProcessing}
                  disabled={actionLoading}
                  className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {actionLoading ? 'Please wait...' : 'Mark as Processing'}
                </button>
              </div>
            ) : null}

            {order.vendor_assignment_status === 'accepted' && order.status === 'processing' ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-[#334155]">Dispatch Action</h3>
                <button
                  onClick={handleMarkDispatched}
                  disabled={actionLoading}
                  className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {actionLoading ? 'Please wait...' : 'Mark as Dispatched'}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </VendorAppLayout>
  )
}

export default VendorOrderDetails
