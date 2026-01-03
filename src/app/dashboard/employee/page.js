"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import EmployeeSide from "@/components/EmployeeSide";

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const [attendanceStats, setAttendanceStats] = useState({
    workingDays: 0,
    presentDays: 0,
    percentage: 0,
  });
  const [leaveStats, setLeaveStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch attendance data
        const attendanceRes = await fetch("/api/attendance/yearly");
        const attendanceData = await attendanceRes.json();

        const year = new Date().getFullYear();
        const startDate = new Date(year, 0, 1);
        const endDate = new Date();

        let workingDays = 0;
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const day = d.getDay();
          if (day !== 0 && day !== 6) {
            workingDays++;
          }
        }

        const presentDays = attendanceData.filter((d) => d.level > 0).length;
        const percentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

        setAttendanceStats({
          workingDays,
          presentDays,
          percentage,
        });

        // Fetch leave data
        const leaveRes = await fetch("/api/leave/my-leaves");
        const leaves = await leaveRes.json();

        const stats = {
          pending: leaves.filter((l) => l.status === "PENDING").length,
          approved: leaves.filter((l) => l.status === "APPROVED").length,
          rejected: leaves.filter((l) => l.status === "REJECTED").length,
          total: leaves.length,
        };

        setLeaveStats(stats);
        setRecentLeaves(leaves.slice(0, 5));
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
        <EmployeeSide screen="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <EmployeeSide screen="dashboard" />
      <div className="flex-1">
        <section className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name}!</h1>
            <p className="text-gray-400">Here's your attendance and leave overview</p>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Employee ID</p>
                <p className="text-xl font-semibold">{session?.user?.employeeId || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-xl font-semibold">{session?.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Role</p>
                <p className="text-xl font-semibold">{session?.user?.role}</p>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Attendance Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard title="Working Days" value={attendanceStats.workingDays} />
              <StatCard title="Days Present" value={attendanceStats.presentDays} />
              <StatCard title="Attendance %" value={`${attendanceStats.percentage}%`} />
              <StatCard
                title="Days Absent"
                value={attendanceStats.workingDays - attendanceStats.presentDays}
              />
            </div>
          </div>

          {/* Leave Stats */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Leave Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard title="Total Leaves" value={leaveStats.total} />
              <StatCard
                title="Pending"
                value={leaveStats.pending}
                color="text-yellow-400"
              />
              <StatCard
                title="Approved"
                value={leaveStats.approved}
                color="text-green-400"
              />
              <StatCard
                title="Rejected"
                value={leaveStats.rejected}
                color="text-red-400"
              />
            </div>
          </div>

          {/* Recent Leaves */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Leave Requests</h2>
            {recentLeaves.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No leave requests</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">From</th>
                      <th className="text-left py-3 px-4">To</th>
                      <th className="text-left py-3 px-4">Days</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeaves.map((leave) => (
                      <tr key={leave.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{leave.leaveType}</td>
                        <td className="py-3 px-4">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {leave.isHalfDay ? "0.5" : leave.totalDays}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeaveStatusColor(
                              leave.status
                            )}`}
                          >
                            {leave.status}
                          </span>
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