"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

export default function CreateRiderModal({ onClose, onCreated }: any) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const createRider = async () => {
    setLoading(true);
    const res = await fetch("/api/riders", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      onCreated();
      onClose();
    } else {
      alert(data.error || data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 w-96 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create Rider</h2>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-4"
          placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={createRider}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
