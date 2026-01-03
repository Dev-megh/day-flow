export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">
          DayFlow
        </div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" active />
          <NavItem label="Employees" />
          <NavItem label="Attendance" />
          <NavItem label="Leaves" />
          <NavItem label="Payroll" />
          <NavItem label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <Header title="Admin Dashboard" />

        <section className="p-6 space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Employees" value="128" />
            <StatCard title="Present Today" value="112" />
            <StatCard title="Pending Leaves" value="6" />
            <StatCard title="Payroll Status" value="Ready" />
          </div>

          <Card title="Recent HR Activity">
            <ul className="space-y-3 text-gray-400">
              <li>✔ Employee onboarded</li>
              <li>✔ Leave approved</li>
              <li>✔ Payroll processed</li>
            </ul>
          </Card>
        </section>
      </div>
    </main>
  );
}
