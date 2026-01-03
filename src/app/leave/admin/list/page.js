"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSide from "@/components/AdminSide";

export default function LeaveAdminListPage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch("/api/leave/all");
        const data = await response.json();
        setLeaves(data || []);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter(
    (leave) =>
      filterStatus === "ALL" || leave.status === filterStatus
  );

  const getStatusBgColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const handleViewLeave = (leaveId) => {
    router.push(`/leave/admin/view/${leaveId}`);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="leaves" />
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Leave Requests</h1>
              <p className="text-gray-400">Manage employee leave requests</p>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full md:w-48"
            >
              <option value="ALL">All Requests</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {filteredLeaves.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  No leave requests found
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr className="text-left text-gray-400">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Days</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeaves.map((leave) => (
                      <LeaveRow
                        key={leave.id}
                        leave={leave}
                        statusColor={getStatusBgColor(leave.status)}
                        onView={() => handleViewLeave(leave.id)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function LeaveRow({ leave, statusColor, onView }) {
  const startDate = new Date(leave.startDate).toLocaleDateString();
  const endDate = new Date(leave.endDate).toLocaleDateString();

  return (
    <tr className="border-t border-white/10 hover:bg-white/5 transition">
      <td className="px-6 py-4 font-medium">{leave.user.name}</td>
      <td className="px-6 py-4 text-gray-400">{leave.leaveType}</td>
      <td className="px-6 py-4 text-gray-400">
        {startDate} – {endDate}
      </td>
      <td className="px-6 py-4 text-gray-400">
        {leave.isHalfDay ? "0.5" : leave.totalDays}
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          {leave.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={onView}
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          View
        </button>
      </td>
    </tr>
  );
}
