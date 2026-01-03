"use client";

import NavItem from "@/components/NavItem";

export default function AdminPayrollPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">
          DayFlow
        </div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" href="/dashboard/admin" />
          <NavItem label="Employees" href="/dashboard/admin" />
          <NavItem label="Attendance" href="/attendance/admin" />
          <NavItem
            label="Payroll"
            href="/dashboard/payroll/admin"
            active
          />
          <NavItem label="Settings" href="/dashboard/settings" />
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Employees" value="128" />
            <StatCard title="Month" value="April 2026" />
            <StatCard title="Total Payout" value="₹18,40,000" />
            <StatCard title="Status" value="Pending" />
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left text-gray-400">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Net Pay</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                <PayrollRow name="Anjali" role="Frontend Dev" net="₹55,000" status="PENDING" />
                <PayrollRow name="Rahul" role="Backend Dev" net="₹64,000" status="PAID" />
              </tbody>
            </table>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <button
              className="px-8 py-3 rounded-xl font-semibold transition
              bg-indigo-500/10 text-indigo-400
              border border-indigo-500/20
              hover:bg-indigo-500/20"
            >
              Run Payroll
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function PayrollRow({ name, role, net, status }) {
  return (
    <tr className="border-t border-white/10 hover:bg-white/5">
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4 text-gray-400">{role}</td>
      <td className="px-6 py-4 font-semibold">{net}</td>
      <td className="px-6 py-4">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PAID: "bg-green-500/10 text-green-400 border-green-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${styles[status]}`}>
      {status}
    </span>
  );
}
