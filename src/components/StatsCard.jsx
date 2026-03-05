import { TrendingUp, TrendingDown } from 'lucide-react'

function StatsCard({ title, value, change, positive, icon: Icon }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-[#CCFBF1] flex items-center justify-center">
          <Icon size={20} className="text-[#0D9488]" />
        </div>
        <span className={`text-sm font-medium ${positive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {positive ? <TrendingUp size={16} className="inline mr-1" /> : <TrendingDown size={16} className="inline mr-1" />}
          {change}
        </span>
      </div>
      <p className="text-sm text-[#64748B] mb-1">{title}</p>
      <p className="text-2xl font-semibold text-[#334155]">{value}</p>
    </div>
  )
}

export default StatsCard
