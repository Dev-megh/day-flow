"use client";

import NavItem from "../../../components/NavItem";

export default function EmployeePayrollPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      {/* Employee Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">DayFlow</div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" href="/dashboard/employee" />
          <NavItem label="Payroll" href="/dashboard/payroll/employee" active />
          <NavItem label="Profile" href="/dashboard/profile" />
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1">
        <Header title="My Payroll" />

        <section className="p-6 max-w-4xl mx-auto space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <StatCard title="Month" value="April 2026" />
            <StatCard title="Net Salary" value="₹55,000" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <Detail label="Basic Salary" value="₹60,000" />
            <Detail label="Deductions" value="₹5,000" />
            <Detail label="Net Pay" value="₹55,000" />
            <Detail label="Status" value={<StatusBadge status="PAID" />} />
          </div>

          <div className="flex justify-end">
            <button
              className="px-8 py-3 rounded-xl font-semibold transition
              bg-indigo-500/10 text-indigo-400
              border border-indigo-500/20
              hover:bg-indigo-500/20"
            >
              Download Payslip
            </button>
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

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
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
