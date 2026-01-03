"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSide from "@/components/AdminSide";

export default function AdminAttendancePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/attendance/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data || []);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAttendance = (employeeId) => {
    router.push(`/attendance/admin/${employeeId}`);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="attendance" />
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Employee Attendance</h1>
            <p className="text-gray-400">
              View and manage employee attendance records
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, employee ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {filteredEmployees.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  {employees.length === 0
                    ? "No employees found"
                    : "No matching employees"}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr className="text-left text-gray-400">
                      <th className="px-6 py-4">Employee ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4 font-medium">
                          {employee.employeeId}
                        </td>
                        <td className="px-6 py-4">{employee.name}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleViewAttendance(employee.id)}
                            className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
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
