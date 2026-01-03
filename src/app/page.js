'use client';

import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center px-6 py-28 max-w-5xl mx-auto">
          <span className="mb-4 px-4 py-1 text-sm rounded-full bg-white/10 border border-white/10">
            Modern HRMS Platform
          </span>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            DayFlow
            <span className="block text-indigo-400 mt-2">
              Simplify Human Resource Management
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-8">
            Manage employees, attendance, leaves, and payroll workflows with a
            fast, secure, and role-based HRMS built for modern teams.
          </p>

          <div className="flex gap-4">
            {session?.user ? <a
              href={`/dashboard/${session.user.role === 'ADMIN' ? 'admin' : 'employee'}`}
              className="inline-block bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-xl font-semibold shadow-xl shadow-indigo-600/30 transition"
            >
              Launch DayFlow
            </a> : <a
              href="signin"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-xl font-semibold shadow-xl shadow-indigo-600/30 transition"
            >
              Get Started
            </a>}
            {/* <a
              href="#features"
              className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition"
            >
              Explore Features
            </a> */}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything You Need in One Platform
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            title="Attendance & Leave"
            desc="Track daily attendance and manage leave approvals with ease."
          />
          <Feature
            title="Payroll Ready"
            desc="Accurate HR data structured for seamless payroll processing."
          />
          <Feature
            title="Role-Based Access"
            desc="Separate dashboards for Admins, HR, and Employees."
          />
        </div>
      </section>

      <section className="bg-white/5 border-y border-white/10 py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          How DayFlow Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <Step
            number="01"
            title="Onboard Employees"
            desc="Add employees, assign roles, and structure your organization."
          />
          <Step
            number="02"
            title="Manage Daily HR"
            desc="Attendance, leaves, and approvals in a few clicks."
          />
          <Step
            number="03"
            title="Run Payroll Smoothly"
            desc="Clean and accurate data for payroll and compliance."
          />
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Designed for Every Role
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <RoleCard
            title="Admins & HR Teams"
            items={[
              "Employee lifecycle management",
              "Leave & attendance approvals",
              "Workforce visibility",
              "Payroll-ready reporting",
            ]}
          />
          <RoleCard
            title="Employees"
            items={[
              "Self-service dashboard",
              "Leave applications",
              "Attendance visibility",
              "Profile & documents access",
            ]}
          />
        </div>
      </section>

      <section className="py-20 px-6 text-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-t border-white/10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Streamline Your HR?
        </h2>
        <p className="text-gray-400 mb-8">
          Focus on people let DayFlow handle the process.
        </p>
        {session?.user ? <a
          href={`/dashboard/${session.user.role === 'ADMIN' ? 'admin' : 'employee'}`}
          className="inline-block bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-xl font-semibold shadow-xl shadow-indigo-600/30 transition"
        >
          Launch DayFlow
        </a> : <a
          href="signin"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-xl font-semibold shadow-xl shadow-indigo-600/30 transition"
        >
          Get Started
        </a>}
      </section>

      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} DayFlow HRMS. Built for modern teams.
      </footer>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div>
      <div className="text-indigo-400 text-4xl font-bold mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function RoleCard({ title, items }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <h3 className="text-2xl font-semibold mb-6">{title}</h3>
      <ul className="space-y-3 text-gray-400">
        {items.map((item, i) => (
          <li key={i}>✔ {item}</li>
        ))}
      </ul>
    </div>
  );
}
