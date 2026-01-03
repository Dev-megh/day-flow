"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EmployeeSide from "@/components/EmployeeSide";

export default function LeaveRequestPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [fetchingLeaves, setFetchingLeaves] = useState(true);

  // Fetch user's leaves
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchLeaves = async () => {
      try {
        const response = await fetch("/api/leave/my-leaves");
        const data = await response.json();
        setMyLeaves(data || []);
      } catch (err) {
        console.error("Failed to fetch leaves:", err);
      } finally {
        setFetchingLeaves(false);
      }
    };

    fetchLeaves();
  }, [session?.user?.id, success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates");
      setLoading(false);
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please provide a reason for leave");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit leave request");
        return;
      }

      setSuccess("Leave request submitted successfully!");
      setFormData({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
        isHalfDay: false,
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-400";
      case "REJECTED":
        return "text-red-400";
      case "PENDING":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10";
      case "REJECTED":
        return "bg-red-500/10";
      case "PENDING":
        return "bg-yellow-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <EmployeeSide screen="leave" />
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Request Leave</h1>
            <p className="text-gray-400">Submit a leave request for approval</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-6">Leave Details</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg mb-6 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Leave Type
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="EARNED">Earned Leave</option>
                    <option value="UNPAID">Unpaid Leave</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Reason
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Brief reason for leave"
                    className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="halfDay"
                    name="isHalfDay"
                    checked={formData.isHalfDay}
                    onChange={handleChange}
                    className="accent-indigo-500"
                  />
                  <label htmlFor="halfDay" className="text-sm text-gray-400">
                    This is a half-day leave
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-6">Leave Balance</h2>

              <LeaveBalance label="Casual Leave" used={6} total={12} />
              <LeaveBalance label="Sick Leave" used={2} total={8} />
              <LeaveBalance label="Earned Leave" used={10} total={18} />

              <div className="mt-6 text-xs text-gray-400">
                Leave balances reset annually as per company policy.
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-6">
              {fetchingLeaves ? "Loading..." : "Your Leave Requests"}
            </h2>

            {!fetchingLeaves && myLeaves.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No leave requests yet
              </p>
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
                    {myLeaves.map((leave) => (
                      <tr
                        key={leave.id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
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
                        <td className={`py-3 px-4 font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status}
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

function LeaveBalance({ label, used, total }) {
  const percent = Math.round((used / total) * 100);

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-gray-400">{total - used} left</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
