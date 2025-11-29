"use client";

import { useState } from "react";

export default function CreateOperator({ onCreated }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    const res = await fetch("/api/operators", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setOpen(false);
      onCreated();
    } else {
      alert(data.error);
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Create Operator
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">Create Operator</h2>

            <input
              placeholder="Full Name"
              className="mb-2 p-2 border w-full"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />

            <input
              placeholder="Email"
              className="mb-2 p-2 border w-full"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder="Phone"
              className="mb-2 p-2 border w-full"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>

              <button
                onClick={submit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
