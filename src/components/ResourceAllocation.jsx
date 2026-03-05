import ResourceCard from './ResourceCard'
import { dummyResources } from './data/dummyData'

function ResourceAllocation() {

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">

      <div className="mb-4">

        <h3 className="text-lg font-semibold text-[#334155]">
          Resource Allocation
        </h3>

        <p className="text-sm text-[#64748B] mt-1">
          Machine utilization and material levels.
        </p>

      </div>

      {dummyResources.map((resource, idx) => (
        <ResourceCard key={idx} {...resource} />
      ))}

    </div>
  )
}

export default ResourceAllocation