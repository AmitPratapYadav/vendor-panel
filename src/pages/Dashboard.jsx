import React from "react";

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Your Other Dashboard Content Above */}

      {/* KYC Card */}
      <div className="bg-blue-100 rounded-xl p-4 shadow">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-blue-800">
            KYC Verification
          </h2>

          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
            PENDING
          </span>
        </div>

        <p className="text-sm text-blue-700 mt-2">
          Please complete your KYC verification to unlock all features and start receiving orders.
        </p>
      </div>

      {/* ✅ SIGN OUT BUTTON FIXED */}
      <button
        type="button"
        onClick={() => alert("Signed Out Successfully")}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition duration-200 cursor-pointer relative z-10"
      >
        Sign Out
      </button>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500">
        System Status: Online • v1.0.0
      </p>

    </div>
  );
}

export default Dashboard;