function ResourceCard({ name, percentage, alert }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#334155]">{name}</span>
        <span className={`text-sm font-medium ${alert ? 'text-[#EF4444]' : 'text-[#334155]'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${alert ? 'bg-[#EF4444]' : 'bg-[#9BCBBF]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ResourceCard
