"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import AdminSide from "@/components/AdminSide";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedToday: 0,
    workingDaysCompleted: 0,
    workingDaysTotal: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (session && session.user?.role !== "ADMIN") {
      router.push("/dashboard/employee");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all employees
        const empRes = await fetch("/api/attendance/employees");
        const employees = await empRes.json();
        setEmployees(employees);

        // Fetch all leaves
        const leaveRes = await fetch("/api/leave/all");
        const allLeaves = await leaveRes.json();

        const pending = allLeaves.filter((l) => l.status === "PENDING");
        setPendingLeaves(pending.slice(0, 5)); // Show 5 most recent pending

        // Calculate working days
        const year = new Date().getFullYear();
        const startDate = new Date(year, 0, 1);
        const endDate = new Date();

        let workingDaysTotal = 0;
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const day = d.getDay();
          if (day !== 0 && day !== 6) {
            workingDaysTotal++;
          }
        }

        // Calculate average attendance
        let totalPresent = 0;
        employees.forEach((emp) => {
          totalPresent += emp.presentDays || 0;
        });

        const avgAttendance =
          employees.length > 0
            ? Math.round((totalPresent / (employees.length * workingDaysTotal)) * 100)
            : 0;

        setStats({
          totalEmployees: employees.length,
          totalLeaves: allLeaves.length,
          pendingLeaves: pending.length,
          approvedToday: allLeaves.filter(
            (l) =>
              l.status === "APPROVED" &&
              new Date(l.approvedAt).toDateString() === new Date().toDateString()
          ).length,
          workingDaysCompleted: workingDaysTotal,
          workingDaysTotal: workingDaysTotal,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLeaveStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-400";
      case "REJECTED":
        return "bg-red-500/10 text-red-400";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <AdminSide screen="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="dashboard" />
      <div className="flex-1">
        <section className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Company-wide attendance and leave overview</p>
          </div>

          {/* Key Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              color="text-blue-400"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingLeaves}
              color="text-yellow-400"
            />
            <StatCard
              title="Approved Today"
              value={stats.approvedToday}
              color="text-green-400"
            />
          </div>

          {/* Attendance Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Leaves"
              value={stats.totalLeaves}
              color="text-indigo-400"
            />
            <StatCard title="Working Days Completed" value={stats.workingDaysCompleted} />
            <StatCard title="Working Days Total" value={stats.workingDaysTotal} />
          </div>

          {/* Pending Leaves Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Pending Leave Approvals</h2>
              <a
                href="/leave/admin/list"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                View All →
              </a>
            </div>
            {pendingLeaves.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending leaves</p>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition"
                  >
                    <div>
                      <p className="font-semibold">{leave.user.name}</p>
                      <p className="text-sm text-gray-400">
                        {leave.leaveType} • {new Date(leave.startDate).toLocaleDateString()} to{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={`/leave/admin/view/${leave.id}`}
                      className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition text-sm"
                    >
                      Review
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Employees Overview */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Employee Overview</h2>
              <a
                href="/attendance/admin"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                View Attendance →
              </a>
            </div>
            {employees.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No employees</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="text-left py-3 px-4">Employee ID</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Days Present</th>
                      <th className="text-left py-3 px-4">Attendance %</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 10).map((emp) => (
                      <tr key={emp.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{emp.employeeId}</td>
                        <td className="py-3 px-4">{emp.name}</td>
                        <td className="py-3 px-4">{emp.presentDays || 0}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">
                            {emp.presentDays && stats.workingDaysTotal
                              ? Math.round((emp.presentDays / stats.workingDaysTotal) * 100)
                              : 0}
                            %
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`/attendance/admin/${emp.id}`}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            View →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value, color = "text-indigo-400" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
