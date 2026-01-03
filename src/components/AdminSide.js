import NavItem from "./NavItem"

function AdminSide({screen}) {
  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">DayFlow</div>

        <nav className="px-4 space-y-2">
            <NavItem label="Dashboard" href="/dashboard/admin" active={screen === "dashboard"} />

            <NavItem label="Employees" href="/dashboard/admin" active={screen === "employees"} />

            <NavItem label="Attendance" href="/attendance/admin" active={screen === "attendance"} />

            <NavItem label="Leaves" href="/leave/admin/list" active={screen === "leaves"} />

            <NavItem label="Payroll" href="/payroll/admin" active={screen === "payroll"} />
        </nav>
    </aside>
  )
}

export default AdminSide