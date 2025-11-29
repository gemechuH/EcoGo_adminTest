"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Button } from "../ui/button";
import { Edit, Loader2 } from "lucide-react";

export default function EditRider({ rider, onUpdated }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(rider);
  const [loading, setLoading] = useState(false);

  const updateRider = async () => {
    setLoading(true);
    const res = await fetch(`/api/riders/${rider.id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      onUpdated();
      setOpen(false);
    } else {
      alert(data.error);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Edit className="w-4 h-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow">
            <h2 className="text-lg mb-4">Edit Rider</h2>

            <input
              className="w-full border p-2 mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-4"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateRider}>
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
