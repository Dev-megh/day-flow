export default function LeaveAdminListPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">
          DayFlow
        </div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" />
          <NavItem label="Employees" />
          <NavItem label="Attendance" />
          <NavItem label="Leaves" active />
          <NavItem label="Payroll" />
        </nav>
      </aside>

      <div className="flex-1">
        <Header title="Leave Requests" />

        <section className="p-6 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left text-gray-400">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                <LeaveRow
                  name="Anjali Sharma"
                  type="Casual Leave"
                  dates="10 Apr – 12 Apr"
                  status="PENDING"
                />
                <LeaveRow
                  name="Rahul Mehta"
                  type="Sick Leave"
                  dates="08 Apr – 09 Apr"
                  status="APPROVED"
                />
                <LeaveRow
                  name="Neha Verma"
                  type="Earned Leave"
                  dates="05 Apr – 07 Apr"
                  status="REJECTED"
                />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}


function Header({ title }) {
  return (
    <header className="px-6 py-4 border-b border-white/10 bg-white/5">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}

function NavItem({ label, active }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-indigo-600 text-white"
          : "hover:bg-white/10 text-gray-300"
      }`}
    >
      {label}
    </div>
  );
}

function LeaveRow({ name, type, dates, status }) {
  return (
    <tr className="border-t border-white/10 hover:bg-white/5 transition">
      <td className="px-6 py-4 font-medium">{name}</td>
      <td className="px-6 py-4 text-gray-400">{type}</td>
      <td className="px-6 py-4 text-gray-400">{dates}</td>
      <td className="px-6 py-4">
        <StatusBadge status={status} />
      </td>
      <td className="px-6 py-4 text-right">
        <a
          href="/dashboard/leave/admin/view"
          className="text-indigo-400 hover:underline"
        >
          View
        </a>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
}
