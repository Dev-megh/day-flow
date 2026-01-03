"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EmployeeSide from "@/components/EmployeeSide";

export default function EmployeeProfilePage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    employeeId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch profile");
        return;
      }

      setFormData({
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        employeeId: data.employeeId || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
        setError("Name, phone, and address are required");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      setSuccess("Profile updated successfully!");
      setFormData({
        ...data,
        email: data.email,
        employeeId: data.employeeId,
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
        <EmployeeSide screen="profile" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-gray-200 flex">
      <EmployeeSide screen="profile" />

      <div className="flex-1">
        <section className="p-6 max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">View and update your profile information</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-white/10">
              <div>
                <label className="text-sm text-gray-400">Employee ID</label>
                <p className="text-lg font-semibold mt-2">{formData.employeeId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-lg font-semibold mt-2">{formData.email}</p>
              </div>
            </div>

            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              textarea
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 rounded-xl font-semibold transition
                bg-indigo-500/10 text-indigo-400
                border border-indigo-500/20
                hover:bg-indigo-500/20 hover:border-indigo-500/30
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
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
          px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl bg-black/30 border border-white/10
          px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        />
      )}
    </div>
  );
}
