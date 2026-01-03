export default function EmployeeDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">DayFlow</div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" active />
          <NavItem label="My Attendance" />
          <NavItem label="My Leaves" />
          <NavItem label="Profile" />
        </nav>
      </aside>

      <div className="flex-1">
        <Header title="Employee Dashboard" />

        <section className="p-6 space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Today" value="Present" />
            <StatCard title="Leaves Left" value="10" />
            <StatCard title="Attendance %" value="96%" />
          </div>

          <Card title="My Recent Activity">
            <ul className="space-y-3 text-gray-400">
              <li>✔ Checked in at 9:05 AM</li>
              <li>✔ Leave request pending</li>
            </ul>
          </Card>
        </section>
      </div>
    </main>
  );
}

function NavItem({ label, active }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg cursor-pointer transition ${
        active ? "bg-indigo-600 text-white" : "hover:bg-white/10 text-gray-300"
      }`}
    >
      {label}
    </div>
  );
}

function Header({ title }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Employee</span>
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
          E
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
