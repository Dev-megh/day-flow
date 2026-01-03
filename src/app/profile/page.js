"use client";

import { useState } from "react";
import EmployeeSide from "@/components/EmployeeSide";

export default function EmployeeProfilePage() {
  const [formData, setFormData] = useState({
    name: "Rishi Chaudhari",
    address: "Pune, Maharashtra, India",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // 🔐 later: API call
    console.log("Updated profile:", formData);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      {/* Sidebar */}
      <EmployeeSide screen="profile" />

      {/* Main Content */}
      <div className="flex-1">
        <section className="p-6 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
            {/* Name */}
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Address */}
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              textarea
            />

            {/* Phone */}
            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* Action */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-xl font-semibold transition
                bg-indigo-500/10 text-indigo-400
                border border-indigo-500/20
                hover:bg-indigo-500/20 hover:border-indigo-500/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputField({ label, name, value, onChange, textarea }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className="w-full rounded-xl bg-black/30 border border-white/10
          px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl bg-black/30 border border-white/10
          px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
}
