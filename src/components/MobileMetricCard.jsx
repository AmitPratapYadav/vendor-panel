function MobileMetricCard({ title, value, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3`} style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <p className="text-2xl font-semibold text-[#334155]">{value}</p>
      <p className="text-sm text-[#64748B]">{title}</p>
    </div>
  )
}

export default MobileMetricCard
