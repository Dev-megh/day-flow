const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function AdminAttendancePage() {
  const year = new Date().getFullYear();
  const data = generateYearAttendance(year);

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 px-6 py-14">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Attendance</h1>
            <p className="text-gray-400">
              Yearly attendance overview (Admin view)
            </p>
          </div>

          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm">
            <option>All Employees</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Rahul Patel</option>
          </select>
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
                {data.map((d, i) => (
                  <div
                    key={i}
                    className={`w-[14px] h-[14px] rounded-sm ${getColor(d.level)}`}
                    title={`${d.date} → ${d.label}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-6 text-xs text-gray-400 gap-2">
            <span>Absent</span>
            <Legend color="bg-white/10" />
            <Legend color="bg-indigo-900" />
            <Legend color="bg-indigo-700" />
            <Legend color="bg-indigo-500" />
            <span>Overtime</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-10">
          <Stat title="Employees" value="24" />
          <Stat title="Working Days" value="288" />
          <Stat title="Avg Attendance" value="92%" />
          <Stat title="Leaves This Year" value="134" />
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold mb-4">
            Attendance Insights
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Fridays show the highest absentee rate</li>
            <li>• Attendance peaks during Q1 & Q3</li>
            <li>• Overtime mostly logged by Engineering</li>
          </ul>
        </div>

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
