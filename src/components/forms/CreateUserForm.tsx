"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "driver", label: "Driver" },
  { value: "rider", label: "Rider" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "support", label: "Support" },
];

export default function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create user");

      alert("User created successfully!");
      router.push("/dashboard/users");
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-xl shadow"
    >
      {/* NAME */}
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* EMAIL */}
      <div>
        <Label>Email</Label>
        <Input
          placeholder="user@email.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      {/* PHONE */}
      <div>
        <Label>Phone</Label>
        <Input
          placeholder="+251912345678"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      {/* ROLE DROPDOWN */}
      <div>
        <Label>Select Role</Label>
        <Select onValueChange={(v) => setForm({ ...form, role: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
