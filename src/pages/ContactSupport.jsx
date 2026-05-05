import VendorAppLayout from '../components/VendorAppLayout'

function ContactSupport() {
  return (
    <VendorAppLayout
      title="Contact Support"
      subtitle="Support actions will be connected in a later phase, but the menu entry and page are now in place."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#334155]">Support Module Pending</h2>
          <p className="mt-3 text-sm text-[#64748B]">
            This page is reserved for vendor-to-support communication, escalation requests, and future WhatsApp or ticket integrations.
          </p>
          <p className="mt-3 text-sm text-[#64748B]">
            In the next phase, this section can be connected to support chat, ticket creation, or direct escalation channels without changing the vendor navigation again.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#334155]">Planned Capabilities</h2>
          <div className="mt-4 space-y-3 text-sm text-[#475569]">
            <p>Support request form for order or payout issues.</p>
            <p>Priority tagging for urgent production blockers.</p>
            <p>Future WhatsApp share button integration.</p>
            <p>Escalation history visible to vendor and admin.</p>
          </div>
        </div>
      </div>
    </VendorAppLayout>
  )
}

export default ContactSupport
