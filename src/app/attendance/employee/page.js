"use client";

import { useAttendance } from "../../../providers/AttendanceProvider";
import EmployeeSide from "../../../components/EmployeeSide";
import { useState, useEffect } from "react";

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

export default function EmployeeAttendancePage() {
  const { checkedIn, checkInTime, checkOutTime, loading, checkIn, checkOut } =
    useAttendance();
  const [attendanceData, setAttendanceData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setFetchingData(true);
        const response = await fetch("/api/attendance/yearly");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setAttendanceData(data || []);
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
        setError("Failed to load attendance data");
      } finally {
        setFetchingData(false);
      }
    };

    fetchAttendanceData();
  }, [checkedIn]);

  const handleCheckIn = async () => {
    setError("");
    setSuccess("");
    const result = await checkIn();
    if (result.success) {
      setSuccess("Checked in successfully!");
    } else {
      setError(result.error || "Failed to check in");
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setSuccess("");
    const result = await checkOut();
    if (result.success) {
      setSuccess("Checked out successfully!");
    } else {
      setError(result.error || "Failed to check out");
    }
  };

  const presentDays = attendanceData.filter((d) => d.level > 0).length;
  
  // Calculate working days (Mon-Fri, excluding today if it hasn't ended)
  const year = new Date().getFullYear();
  const startDate = new Date(year, 0, 1);
  const endDate = new Date();
  
  let workingDays = 0;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) { // Exclude Sunday(0) and Saturday(6)
      workingDays++;
    }
  }
  
  const attendancePercentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <EmployeeSide screen="attendance" />
      <div className="flex-1">
        <section className="p-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Attendance</h1>
              <p className="text-gray-400">
                Yearly attendance overview
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 overflow-hidden">
            <div className="flex text-xs text-gray-400 mb-2 pl-10">
              {MONTH_NAMES.map((m) => (
                <div key={m} className="w-[72px]">{m}</div>
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
                  {fetchingData ? (
                    <div className="text-sm text-gray-400">Loading...</div>
                  ) : attendanceData.length > 0 ? (
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
            <Stat title="Avg Attendance" value={`${attendancePercentage}%`} />
            <Stat title="Leaves This Year" value="5" />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {!checkedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-semibold transition
                  bg-green-500/10 text-green-400
                  border border-green-500/20
                  hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Check In"}
                </button>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="text-green-400 font-medium">
                      ✓ Checked in at{" "}
                      {checkInTime?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {checkOutTime && (
                      <div className="text-blue-400 text-sm mt-1">
                        Checked out at{" "}
                        {checkOutTime?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>

                  {!checkOutTime && (
                    <button
                      onClick={handleCheckOut}
                      disabled={loading}
                      className="px-6 py-3 rounded-xl font-semibold transition
                      bg-red-500/10 text-red-400
                      border border-red-500/20
                      hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : "Check Out"}
                    </button>
                  )}
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
    case 0:
      return "bg-white/10"; // Absent
    case 1:
      return "bg-indigo-900"; // Half Day
    case 2:
      return "bg-indigo-700"; // Present
    case 3:
      return "bg-indigo-500"; // Full Day
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
