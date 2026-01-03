"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN";
  const isEmployee = session?.user?.role === "EMPLOYEE";

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F1A]/85 backdrop-blur border-b border-white/10">
      <div className="w-full px-16 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-indigo-400">
          DayFlow
        </Link>

        <div className="hidden md:flex items-center gap-2 text-sm">
          {isEmployee && (
            <>
              <NavLink href="/dashboard/employee" active={pathname.startsWith("/dashboard/employee")}>
                Dashboard
              </NavLink>
              <NavLink href="/attendance/employee" active={pathname.startsWith("/attendance")}>
                Attendance
              </NavLink>
              <NavLink href="/leave/apply" active={pathname.startsWith("/leave/apply")}>
                Leave
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink href="/dashboard/admin">Admin</NavLink>
              <NavLink href="/attendance/admin">Attendance</NavLink>
              <NavLink href="/leave/admin/view">Leaves</NavLink>
              <NavLink href="/admin/employees">Employees</NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-sm font-medium">
                {session.user.name[0]}
              </div>
              <span className="hidden sm:block text-sm text-gray-400">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Link href="signin" className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition">
                Login
              </Link>
              <Link href="signup" className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

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