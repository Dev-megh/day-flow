'use client';

import { useAttendance } from "@/context/AttendanceContext";
import EmployeeSide from "@/components/EmployeeSide";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function EmployeeAttendancePage() {
  const { checkedIn, checkInTime, loading, checkIn, checkOut } = useAttendance();
  const year = new Date().getFullYear();
  const data = generateYearAttendance(year);

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <EmployeeSide screen="attendance" />
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto">
          {/* ...existing content... */}

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {!checkedIn ? (
                <button
                  onClick={checkIn}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-semibold transition
                  bg-green-500/10 text-green-400
                  border border-green-500/20
                  hover:bg-green-500/20 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Check In"}
                </button>
              ) : (
                <>
                  <span className="text-green-400">
                    Checked in at {checkInTime?.toLocaleTimeString()}
                  </span>
                  <button
                    onClick={checkOut}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl font-semibold transition
                    bg-red-500/10 text-red-400
                    border border-red-500/20
                    hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Check Out"}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function getColor(level) {
  switch (level) {
    case 0: return "bg-white/10";
    case 1: return "bg-indigo-900";
    case 2: return "bg-indigo-700";
    case 3: return "bg-indigo-500";
    default: return "bg-white/10";
  }
}

function generateYearAttendance(year) {
  const result = [];
  const date = new Date(year, 0, 1);

  while (date.getFullYear() === year) {
    const day = date.getDay();

    if (day !== 0) {
      const level = Math.floor(Math.random() * 4);
      result.push({
        date: date.toISOString().split("T")[0],
        level,
        label:
          level === 0 ? "Absent" :
          level === 1 ? "Half Day" :
          level === 2 ? "Present" : "Overtime"
      });
    }

    date.setDate(date.getDate() + 1);
  }

  return result;
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
