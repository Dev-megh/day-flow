import AdminSide from "@/components/AdminSide";
import NavItem from "../../../components/NavItem";
export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide />
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
