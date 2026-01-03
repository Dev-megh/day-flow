"use client";

import { useState, useEffect } from "react";
import AdminSide from "@/components/AdminSide";
import { useRouter } from "next/navigation";

export default function EditPayrollPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    baseSalary: "",
    bonuses: "",
    deductions: "",
    status: "",
  });

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetchPayroll();
  }, [id]);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/payroll/[id]?id=${id}`);
      if (!res.ok) throw new Error("Failed to fetch payroll");
      const data = await res.json();
      setPayroll(data);
      setFormData({
        baseSalary: data.baseSalary.toString(),
        bonuses: data.bonuses.toString(),
        deductions: data.deductions.toString(),
        status: data.status,
      });
    } catch (error) {
      console.error("Error fetching payroll:", error);
      alert("Failed to load payroll details");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/payroll/[id]?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseSalary: parseFloat(formData.baseSalary),
          bonuses: parseFloat(formData.bonuses) || 0,
          deductions: parseFloat(formData.deductions) || 0,
          status: formData.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to update payroll");
      alert("Payroll updated successfully");
      router.push("/payroll/admin");
    } catch (error) {
      console.error("Error saving payroll:", error);
      alert("Failed to save payroll");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <AdminSide screen="payroll" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading payroll...</p>
        </div>
      </main>
    );
  }

  if (!payroll) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <AdminSide screen="payroll" />
        <div className="flex-1 flex items-center justify-center">
          <p>Payroll not found</p>
        </div>
      </main>
    );
  }

  const month = new Date(payroll.paymentYear, payroll.paymentMonth - 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="payroll" />

      <div className="flex-1">
        <section className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push("/payroll/admin")}
              className="text-indigo-400 hover:text-indigo-300 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold">Edit Payroll</h1>
            <p className="text-gray-400 mt-1">
              {payroll.user.name} • {month}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Employee Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Employee ID</p>
                <p className="text-lg font-semibold">{payroll.user.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg font-semibold">{payroll.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg font-semibold">{payroll.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Period</p>
                <p className="text-lg font-semibold">{month}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Working Days</p>
                <p className="text-2xl font-bold">{payroll.workingDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Days Present</p>
                <p className="text-2xl font-bold text-green-400">{payroll.presentDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Days Absent</p>
                <p className="text-2xl font-bold text-red-400">{payroll.absentDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Attendance %</p>
                <p className="text-2xl font-bold">
                  {((payroll.presentDays / payroll.workingDays) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Salary Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Base Salary</label>
                <input
                  type="number"
                  value={formData.baseSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, baseSalary: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Calculated Salary (Based on Attendance)
                </label>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="font-semibold">
                    ₹{payroll.calculatedSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ({payroll.presentDays} / {payroll.workingDays}) × ₹{payroll.baseSalary.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bonuses</label>
                  <input
                    type="number"
                    value={formData.bonuses}
                    onChange={(e) =>
                      setFormData({ ...formData, bonuses: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Deductions</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) =>
                      setFormData({ ...formData, deductions: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Total Salary Summary</h2>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-gray-400">Calculated Salary:</span>
                <span>₹{payroll.calculatedSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bonuses:</span>
                <span className="text-green-400">+ ₹{parseFloat(formData.bonuses).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deductions:</span>
                <span className="text-red-400">- ₹{parseFloat(formData.deductions).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t border-white/10 pt-2 mt-2">
                <span>Net Pay:</span>
                <span>
                  ₹{(payroll.calculatedSalary + parseFloat(formData.bonuses || 0) - parseFloat(formData.deductions || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              onClick={() => router.push("/payroll/admin")}
              className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
