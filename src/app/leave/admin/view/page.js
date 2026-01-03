import AdminSide from "@/components/AdminSide";

export default function LeaveAdminViewPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <div className="flex-1">
        <section className="p-6 max-w-4xl mx-auto space-y-6">

          <Card title="Employee Information">
            <Detail label="Employee Name" value="Anjali Sharma" />
            <Detail label="Employee ID" value="EMP-1024" />
            <Detail label="Department" value="Engineering" />
          </Card>

          <Card title="Leave Details">
            <Detail label="Leave Type" value="Casual Leave" />
            <Detail label="From Date" value="10 Apr 2026" />
            <Detail label="To Date" value="12 Apr 2026" />
            <Detail label="Total Days" value="3" />
            <Detail label="Reason" value="Family function" />
            <Detail label="Status" value={<StatusBadge status="PENDING" />} />
          </Card>

          <div className="flex gap-4 justify-end">
            <button className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-semibold transition">
              Approve
            </button>
            <button className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition">
              Reject
            </button>
          </div>    
        </section>
      </div>
    </main>
  );
}

function Header({ title }) {
  return (
    <header className="px-6 py-4 border-b border-white/10 bg-white/5">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
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

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    APPROVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
