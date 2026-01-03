import AdminSide from "@/components/AdminSide";
import NavItem from "../../../components/NavItem";
export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <AdminSide screen="dashboard" />
      <div className="flex-1">
        <section className="p-6 space-y-8">

        </section>
      </div>
    </main>
  );
}
