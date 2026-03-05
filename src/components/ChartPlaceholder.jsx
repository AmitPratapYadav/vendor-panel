import { BarChart3 } from "lucide-react";

function ChartPlaceholder() {

  const handleViewReport = () => {
    alert("Opening Production Report");
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#334155]">
            Recent Production Output
          </h3>

          <p className="text-sm text-[#64748B]">
            Units printed vs quality pass rate.
          </p>
        </div>

        <button
          onClick={handleViewReport}
          className="text-sm font-medium text-[#9BCBBF] hover:text-[#7FB8A8] transition cursor-pointer"
        >
          View Report
        </button>

      </div>

      {/* Chart Box */}
      <div className="h-56 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center">

        <div className="text-center">

          <BarChart3
            size={40}
            className="text-[#CBD5E1] mx-auto mb-2"
          />

          <p className="text-sm text-[#94A3B8]">
            Chart visualization
          </p>

        </div>

      </div>

    </div>
  );
}

export default ChartPlaceholder;