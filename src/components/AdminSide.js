import NavItem from "./NavItem"

function AdminSide() {
  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">DayFlow</div>

        <nav className="px-4 space-y-2">
            <NavItem label="Dashboard" href="/dashboard/admin" active />

            <NavItem label="Employees" href="/dashboard/admin" />

            <NavItem label="Attendance" href="/attendance/admin" />

            <NavItem label="Leaves" href="/leave/admin/list" />

            <NavItem label="Payroll" href="/payroll/admin" />
        </nav>
    </aside>
  )
}

export default AdminSide