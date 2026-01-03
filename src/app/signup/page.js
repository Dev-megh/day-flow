"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      router.push("/signin");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-cyan-600/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-400 text-center mb-8">Sign up to get started with DayFlow</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP001"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="EMPLOYEE" className="bg-[#0B0F1A]">
                Employee
              </option>
              <option value="ADMIN" className="bg-[#0B0F1A]">
                HR
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}