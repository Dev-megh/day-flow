"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSide from "@/components/AdminSide";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminEmployeeAttendancePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;

  const [employee, setEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/attendance/employees/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch attendance data");
        const data = await response.json();
        setAttendanceData(data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const presentDays = attendanceData.filter((d) => d.level > 0).length;

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

  const attendancePercentage =
    workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <AdminSide screen="attendance" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="attendance" />
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Employee Attendance</h1>
              <p className="text-gray-400">Employee ID: EMP001</p>
            </div>
            <button
              onClick={() => router.push("/attendance/admin")}
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
            >
              Back to Employees
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 overflow-hidden">
            <div className="flex text-xs text-gray-400 mb-2 pl-10">
              {MONTH_NAMES.map((m) => (
                <div key={m} className="w-[72px]">
                  {m}
                </div>
              ))}
            </div>

            <div className="flex">
              <div className="flex flex-col text-xs text-gray-400 mr-3">
                {WEEK_DAYS.map((day) => (
                  <div key={day} className="h-[14px] mb-[6px]">
                    {day}
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <div
                  className="grid grid-flow-col gap-[6px]"
                  style={{ gridTemplateRows: "repeat(6, 14px)" }}
                >
                  {attendanceData.length > 0 ? (
                    attendanceData.map((d, i) => (
                      <div
                        key={i}
                        className={`w-[14px] h-[14px] rounded-sm ${getColor(d.level)}`}
                        title={`${d.date} → ${d.label}`}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-gray-400">No data</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-6 text-xs text-gray-400 gap-2">
              <span>Absent</span>
              <Legend color="bg-white/10" />
              <Legend color="bg-indigo-900" />
              <Legend color="bg-indigo-700" />
              <Legend color="bg-indigo-500" />
              <span>Full Day</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <Stat title="Working Days" value={workingDays} />
            <Stat title="Days Worked" value={presentDays} />
            <Stat title="Attendance %" value={`${attendancePercentage}%`} />
            <Stat title="Absent Days" value={workingDays - presentDays} />
          </div>
        </section>
      </div>
    </main>
  );
}

function getColor(level) {
  switch (level) {
    case 0:
      return "bg-white/10";
    case 1:
      return "bg-indigo-900";
    case 2:
      return "bg-indigo-700";
    case 3:
      return "bg-indigo-500";
    default:
      return "bg-white/10";
  }
}

function Legend({ color }) {
  return <div className={`w-4 h-4 rounded-sm ${color}`} />;
}

function Stat({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
