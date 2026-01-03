"use client";

import { useState, useEffect } from "react";
import EmployeeSide from "@/components/EmployeeSide";

export default function EmployeePayrollPage() {
  const [payroll, setPayroll] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payroll");
      const data = await res.json();
      setPayroll(data);
      if (data.length > 0) {
        setSelectedId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch payroll:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentPayroll = payroll.find((p) => p.id === selectedId);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <EmployeeSide screen="payroll" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading payroll...</p>
        </div>
      </main>
    );
  }

  if (payroll.length === 0) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <EmployeeSide screen="payroll" />
        <div className="flex-1">
          <section className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Payroll</h1>
            <p className="text-gray-400 mb-8">View your salary and payment details</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-gray-400">
              No payroll records yet
            </div>
          </section>
        </div>
      </main>
    );
  }

  const month = new Date(currentPayroll.paymentYear, currentPayroll.paymentMonth - 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const attendancePercentage = (currentPayroll.presentDays / currentPayroll.workingDays * 100).toFixed(1);

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <EmployeeSide screen="payroll" />

      <div className="flex-1">
        <section className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">My Payroll</h1>
            <p className="text-gray-400">View your salary and payment details</p>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Select Period</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              {payroll.map((p) => {
                const m = new Date(p.paymentYear, p.paymentMonth - 1).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" }
                );
                return (
                  <option key={p.id} value={p.id}>
                    {m}
                  </option>
                );
              })}
            </select>
          </div>

          {currentPayroll && (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <StatCard title="Period" value={month} />
                <StatCard title="Net Salary" value={`₹${currentPayroll.totalSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                <StatCard title="Status" value={<StatusBadge status={currentPayroll.status} />} />
              </div>

              {/* Attendance Info */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold mb-4">Attendance Information</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Working Days</p>
                    <p className="text-2xl font-bold">{currentPayroll.workingDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Days Present</p>
                    <p className="text-2xl font-bold text-green-400">{currentPayroll.presentDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Days Absent</p>
                    <p className="text-2xl font-bold text-red-400">{currentPayroll.absentDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Attendance %</p>
                    <p className="text-2xl font-bold">{attendancePercentage}%</p>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-bold mb-4">Salary Breakdown</h2>
                <div className="space-y-4">
                  <Detail label="Base Salary" value={`₹${currentPayroll.baseSalary.toLocaleString()}`} />
                  <Detail
                    label="Calculated Salary"
                    value={`₹${currentPayroll.calculatedSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    subtext={`${currentPayroll.presentDays}/${currentPayroll.workingDays} days`}
                  />
                  <Detail
                    label="Bonuses"
                    value={`₹${currentPayroll.bonuses.toLocaleString()}`}
                    highlight={currentPayroll.bonuses > 0 ? "text-green-400" : ""}
                  />
                  <Detail
                    label="Deductions"
                    value={`₹${currentPayroll.deductions.toLocaleString()}`}
                    highlight={currentPayroll.deductions > 0 ? "text-red-400" : ""}
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Net Pay</p>
                    <p className="text-4xl font-bold">₹{currentPayroll.totalSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Calculation</p>
                    <p className="text-sm font-mono text-indigo-300">
                      {currentPayroll.calculatedSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      {currentPayroll.bonuses > 0 ? ` + ${currentPayroll.bonuses.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ""}
                      {currentPayroll.deductions > 0 ? ` - ${currentPayroll.deductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
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

function Detail({ label, value, highlight = "", subtext = "" }) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
      <div>
        <p className="text-gray-400">{label}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      <p className={`font-semibold ${highlight}`}>{value}</p>
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
