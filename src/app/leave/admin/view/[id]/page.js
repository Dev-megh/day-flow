"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSide from "@/components/AdminSide";

export default function LeaveAdminViewPage() {
  const router = useRouter();
  const params = useParams();
  const leaveId = params.id;

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [approverComment, setApproverComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!leaveId) return;

    const fetchLeave = async () => {
      try {
        const response = await fetch(`/api/leave/${leaveId}`);
        const data = await response.json();
        setLeave(data);
        setApproverComment(data.approverComment || "");
      } catch (err) {
        console.error("Failed to fetch leave:", err);
        setError("Failed to load leave details");
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [leaveId]);

  const handleApprove = async () => {
    if (!approverComment.trim()) {
      setError("Please add a comment before approving");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "APPROVED",
          approverComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to approve leave");
        return;
      }

      setLeave(data);
      setSuccess("Leave approved successfully!");
      setTimeout(() => router.push("/leave/admin/list"), 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!approverComment.trim()) {
      setError("Please add a reason for rejection");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/leave/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          approverComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reject leave");
        return;
      }

      setLeave(data);
      setSuccess("Leave rejected successfully!");
      setTimeout(() => router.push("/leave/admin/list"), 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/leave/${leaveId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setLeave((prev) => ({
          ...prev,
          comments: [newComment, ...prev.comments],
        }));
        setComment("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <AdminSide screen="leaves" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!leave) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <AdminSide screen="leaves" />
        <div className="flex-1 flex items-center justify-center">
          <p>Leave not found</p>
        </div>
      </main>
    );
  }

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

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="leaves" />
      <div className="flex-1">
        <section className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Leave Request</h1>
            <button
              onClick={() => router.push("/leave/admin/list")}
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
            >
              Back to List
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <Card title="Employee Information">
            <Detail label="Employee Name" value={leave.user.name} />
            <Detail label="Employee ID" value={leave.user.employeeId} />
            <Detail label="Email" value={leave.user.email} />
          </Card>

          <Card title="Leave Details">
            <Detail label="Leave Type" value={leave.leaveType} />
            <Detail
              label="From Date"
              value={new Date(leave.startDate).toLocaleDateString()}
            />
            <Detail
              label="To Date"
              value={new Date(leave.endDate).toLocaleDateString()}
            />
            <Detail
              label="Total Days"
              value={leave.isHalfDay ? "0.5" : leave.totalDays}
            />
            <Detail label="Reason" value={leave.reason} />
            <Detail
              label="Status"
              value={
                <span className={`font-medium ${getStatusColor(leave.status)}`}>
                  {leave.status}
                </span>
              }
            />
            {leave.approvedAt && (
              <Detail
                label="Approved Date"
                value={new Date(leave.approvedAt).toLocaleDateString()}
              />
            )}
          </Card>

          {leave.status === "PENDING" && (
            <Card title="Approval">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Approver Comment
                  </label>
                  <textarea
                    value={approverComment}
                    onChange={(e) => setApproverComment(e.target.value)}
                    placeholder="Add your comment here..."
                    rows="4"
                    className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 font-semibold transition"
                  >
                    {actionLoading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 font-semibold transition"
                  >
                    {actionLoading ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            </Card>
          )}

          <Card title="Comments">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {leave.comments && leave.comments.length > 0 ? (
                  leave.comments.map((cmt) => (
                    <div key={cmt.id} className="bg-[#0B0F1A] rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          {cmt.user.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(cmt.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{cmt.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No comments yet
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-200">{value}</span>
    </div>
  );
}