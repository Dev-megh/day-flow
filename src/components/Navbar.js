"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Mock auth state (replace later)
  const [user, setUser] = useState({
    name: "John Doe",
    role: "EMPLOYEE", // ADMIN | EMPLOYEE | null
  });

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "EMPLOYEE";

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F1A]/85 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-indigo-400"
        >
          DayFlow
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          {!isLoggedIn && (
            <>
              <NavLink href="#features" active={pathname === "/"}>
                Features
              </NavLink>
              <NavLink href="/login">Login</NavLink>
              <NavLink href="/signup" highlight>
                Get Started
              </NavLink>
            </>
          )}

          {isEmployee && (
            <>
              <NavLink
                href="/employee/dashboard"
                active={pathname.startsWith("/employee/dashboard")}
              >
                Dashboard
              </NavLink>
              <NavLink
                href="/attendance"
                active={pathname.startsWith("/attendance")}
              >
                Attendance
              </NavLink>
              <NavLink
                href="/employee/leave-request"
                active={pathname.startsWith("/employee/leave-request")}
              >
                Leave
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink href="/admin/dashboard">Admin</NavLink>
              <NavLink href="/admin/attendance">Attendance</NavLink>
              <NavLink href="/admin/leaves">Leaves</NavLink>
              <NavLink href="/admin/employees">Employees</NavLink>
            </>
          )}
        </div>

        {/* Right User Area */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-sm font-medium">
                {user.name[0]}
              </div>

              <span className="hidden sm:block text-sm text-gray-400">
                {user.name}
              </span>

              <button
                onClick={() => setUser(null)}
                className="text-sm px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ---------- NavLink ---------- */

function NavLink({ href, children, highlight, active }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg transition font-medium ${
        highlight
          ? "bg-indigo-600 text-white hover:bg-indigo-500"
          : active
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}
