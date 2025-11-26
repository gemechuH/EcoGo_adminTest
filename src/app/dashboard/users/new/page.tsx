"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    roleId: "",
  });

  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "super_admin", label: "Super Admin" },
    { id: "admin", label: "Admin" },
    { id: "hr", label: "HR" },
    { id: "driver", label: "Driver" },
    { id: "rider", label: "Rider" },
    { id: "support", label: "Support" },
    { id: "finance", label: "Finance" },
  ];

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create user");

      alert("User Created Successfully!");
      router.push("/dashboard/users");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create New User</h1>

      <div>
        <Label>Full Name</Label>
        <Input
          placeholder="Enter full name"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          placeholder="Enter email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          placeholder="Enter password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div>
        <Label>Role</Label>
        <select
          className="border rounded-md p-2 w-full"
          value={form.roleId}
          onChange={(e) => setForm({ ...form, roleId: e.target.value })}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full" onClick={submit} disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </div>
  );
}
