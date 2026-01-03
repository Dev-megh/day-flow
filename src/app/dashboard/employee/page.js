import NavItem from "../../../components/NavItem";
export default function EmployeeDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">DayFlow</div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" active  href="/dashboard/employee"/>
          <NavItem label="My Attendance" href="/attendance/employee" />
          <NavItem label="My Leaves" href="/leave/apply" />
          <NavItem label="Profile" href=""/>
        </nav>
      </aside>

      <div className="flex-1">
        <section className="p-6 space-y-8">
          
        </section>
      </div>
    </main>
  );
}