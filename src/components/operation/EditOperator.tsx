"use client";

import { useState } from "react";

export default function EditOperator({ operator }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: operator.fullName,
    email: operator.email,
    phone: operator.phone,
  });
  const [loading, setLoading] = useState(false);

  const update = async () => {
    setLoading(true);

    const res = await fetch(`/api/operators/${operator.id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Updated Successfully");
      location.reload(); // refresh table
    } else {
      alert(data.error);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 w-96 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Operator</h2>

            <input
              className="w-full border p-2 mb-2"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-2"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>

              <button
                onClick={update}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
