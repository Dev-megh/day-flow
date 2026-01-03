"use client";

import { useState, useEffect } from "react";
import AdminSide from "@/components/AdminSide";

export default function AdminPayrollPage() {
  const [payroll, setPayroll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    employeeId: "",
    baseSalary: "",
    deductions: "",
    bonuses: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all payroll
      const payrollRes = await fetch("/api/payroll");
      const allPayroll = await payrollRes.json();

      // Filter by selected month and year
      const filtered = allPayroll.filter(
        (p) => p.paymentMonth === selectedMonth && p.paymentYear === selectedYear
      );
      setPayroll(filtered);

      // Fetch employees
      const empRes = await fetch("/api/attendance/employees");
      const emps = await empRes.json();
      setEmployees(emps);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayroll = async (e) => {
    e.preventDefault();
    try {
      const emp = employees.find((e) => e.employeeId === createData.employeeId);
      if (!emp) {
        alert("Employee not found");
        return;
      }

      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: emp.id,
          baseSalary: parseFloat(createData.baseSalary),
          deductions: createData.deductions ? parseFloat(createData.deductions) : 0,
          bonuses: createData.bonuses ? parseFloat(createData.bonuses) : 0,
          paymentMonth: selectedMonth,
          paymentYear: selectedYear,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to create payroll");
        return;
      }

      setCreateData({ employeeId: "", baseSalary: "", deductions: "", bonuses: "" });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error("Error creating payroll:", error);
      alert("Failed to create payroll");
    }
  };

  const totalPayout = payroll.reduce((sum, p) => sum + p.totalSalary, 0);
  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="payroll" />

      <div className="flex-1">
        <section className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Payroll Management</h1>
              <p className="text-gray-400">View and manage employee payroll</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition"
            >
              {showCreateForm ? "Cancel" : "Add Payroll"}
            </button>
          </div>

          {showCreateForm && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold mb-4">Create New Payroll Entry</h2>
              <form onSubmit={handleCreatePayroll} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Employee</label>
                  <select
                    value={createData.employeeId}
                    onChange={(e) =>
                      setCreateData({ ...createData, employeeId: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.employeeId}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Base Salary</label>
                  <input
                    type="number"
                    value={createData.baseSalary}
                    onChange={(e) =>
                      setCreateData({ ...createData, baseSalary: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    placeholder="Enter base salary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bonuses</label>
                  <input
                    type="number"
                    value={createData.bonuses}
                    onChange={(e) =>
                      setCreateData({ ...createData, bonuses: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    placeholder="Enter bonuses (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Deductions</label>
                  <input
                    type="number"
                    value={createData.deductions}
                    onChange={(e) =>
                      setCreateData({ ...createData, deductions: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    placeholder="Enter deductions (optional)"
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 px-6 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                >
                  Create Payroll
                </button>
              </form>
            </div>
          )}

          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2025, m - 1).toLocaleDateString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                {[2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <StatCard title="Period" value={monthName} />
            <StatCard title="Payroll Entries" value={payroll.length} />
            <StatCard title="Total Payout" value={`₹${totalPayout.toLocaleString()}`} />
            <StatCard title="Avg Salary" value={`₹${(totalPayout / (payroll.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {payroll.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No payroll entries for {monthName}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4">Employee ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Base Salary</th>
                    <th className="px-6 py-4">Days Present</th>
                    <th className="px-6 py-4">Calculated Salary</th>
                    <th className="px-6 py-4">Bonuses</th>
                    <th className="px-6 py-4">Deductions</th>
                    <th className="px-6 py-4">Net Pay</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payroll.map((p) => (
                    <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-6 py-4">{p.user.employeeId}</td>
                      <td className="px-6 py-4">{p.user.name}</td>
                      <td className="px-6 py-4">₹{p.baseSalary.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {p.presentDays} / {p.workingDays}
                      </td>
                      <td className="px-6 py-4">₹{p.calculatedSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="px-6 py-4">₹{p.bonuses.toLocaleString()}</td>
                      <td className="px-6 py-4">₹{p.deductions.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold">
                        ₹{p.totalSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/payroll/admin/${p.id}`}
                          className="text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                          Edit →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PAID: "bg-green-500/10 text-green-400 border-green-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}
