export default function LeaveRequestPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 px-6 py-14">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Request Leave
          </h1>
          <p className="text-gray-400">
            Submit a leave request for approval
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-6">
              Leave Details
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Leave Type
                </label>
                <select className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Paid Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Reason
                </label>
                <textarea
                  rows="4"
                  placeholder="Brief reason for leave"
                  className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="halfDay"
                  className="accent-indigo-500"
                />
                <label htmlFor="halfDay" className="text-sm text-gray-400">
                  This is a half-day leave
                </label>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/30"
              >
                Submit Request
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-6">
              Leave Balance
            </h2>

            <LeaveBalance label="Casual Leave" used={6} total={12} />
            <LeaveBalance label="Sick Leave" used={2} total={8} />
            <LeaveBalance label="Paid Leave" used={10} total={18} />

            <div className="mt-6 text-xs text-gray-400">
              Leave balances reset annually as per company policy.
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-6">
            Recent Leave Requests
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">From</th>
                  <th className="text-left py-2">To</th>
                  <th className="text-left py-2">Days</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <LeaveRow
                  type="Casual"
                  from="2026-01-02"
                  to="2026-01-03"
                  days="2"
                  status="Approved"
                />
                <LeaveRow
                  type="Sick"
                  from="2025-12-18"
                  to="2025-12-18"
                  days="1"
                  status="Rejected"
                />
                <LeaveRow
                  type="Paid"
                  from="2025-11-10"
                  to="2025-11-15"
                  days="6"
                  status="Pending"
                />
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}

function LeaveBalance({ label, used, total }) {
  const percent = Math.round((used / total) * 100);

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-gray-400">
          {total - used} left
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function LeaveRow({ type, from, to, days, status }) {
  const color =
    status === "Approved"
      ? "text-green-400"
      : status === "Rejected"
      ? "text-red-400"
      : "text-yellow-400";

  return (
    <tr className="border-b border-white/5">
      <td className="py-3">{type}</td>
      <td className="py-3">{from}</td>
      <td className="py-3">{to}</td>
      <td className="py-3">{days}</td>
      <td className={`py-3 font-medium ${color}`}>
        {status}
      </td>
    </tr>
  );
}
