"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

type FormState = {
  displayName: string;
  email: string;
  password: string;
  phone?: string;
  roleId: string;
  status: "active" | "inactive" | "pending";
};

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
  { value: "hr", label: "HR" },
  { value: "driver", label: "Driver" },
  { value: "rider", label: "Rider" },
  { value: "it_support", label: "IT Support" },
];

export default function UserCreate() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    displayName: "",
    email: "",
    password: "",
    phone: "",
    roleId: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // helper: client side validation
  function validate(): string | null {
    if (!form.displayName?.trim()) return "Name is required.";
    if (!form.email?.includes("@")) return "Valid email is required.";
    if (!form.password || form.password.length < 8)
      return "Password is required (min 8 chars).";
    if (!form.roleId) return "Please select a role.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);

    try {
      // get current user's ID token (so server can verify)
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("You must be signed in as admin to create users.");
        setLoading(false);
        return;
      }
      const idToken = await currentUser.getIdToken();

      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: form.displayName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          roleId: form.roleId,
          status: form.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || data?.error || "Create failed");
        setLoading(false);
        return;
      }

      setSuccessMsg("User created successfully.");
      setForm({
        displayName: "",
        email: "",
        password: "",
        phone: "",
        roleId: "",
        status: "active",
      });

      // optional: redirect to users list
      setTimeout(() => router.push("/dashboard/users"), 900);
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>

      {error && (
        <div className="mb-4 text-red-700 bg-red-100 p-3 rounded">{error}</div>
      )}
      {successMsg && (
        <div className="mb-4 text-green-700 bg-green-100 p-3 rounded">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            className="w-full border rounded p-2"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full border rounded p-2"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            className="w-full border rounded p-2"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone (optional)
          </label>
          <input
            className="w-full border rounded p-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+2519..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            className="w-full border rounded p-2"
            value={form.roleId}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
          >
            <option value="">Select role</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border rounded p-2"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as FormState["status"],
              })
            }
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white rounded p-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create user"}
          </button>
        </div>
      </form>
    </div>
  );
}
