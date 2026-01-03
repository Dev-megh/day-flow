import React from 'react'
import NavItem from './NavItem'

const EmployeeSide = ({screen}) => {
  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-400">DayFlow</div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" href="/dashboard/employee" active={screen === "dashboard"} />
          <NavItem label="My Attendance" href="/attendance/employee" active={screen === "attendance"} />
          <NavItem label="My Leaves" href="/leave/apply" active={screen === "leave"} />
          <NavItem label="Profile" href="/profile" active={screen === "profile"} />
        </nav>
      </aside>
  )
}

export default EmployeeSide