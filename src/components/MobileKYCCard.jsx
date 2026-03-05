function MobileKYCCard() {
  return (
    <div className="bg-[#DBEAFE] rounded-2xl p-5 shadow-md mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#1E40AF]">KYC Verification</h3>
        <span className="px-3 py-1 bg-[#F59E0B] text-white text-xs font-medium rounded-full">
          PENDING
        </span>
      </div>
      <p className="text-sm text-[#1E40AF]">
        Please complete your KYC verification to unlock all features and start receiving orders.
      </p>
    </div>
  )
}

export default MobileKYCCard
