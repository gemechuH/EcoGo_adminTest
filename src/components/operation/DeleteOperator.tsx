"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteOperator({ operatorId }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    setLoading(true);

    const res = await fetch(`/api/operators/${operatorId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Deleted Successfully");
      location.reload();
    } else {
      alert(data.error);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setOpen(true)}
        className=" cursor-pointer"
        
      >
        <Trash2 className="w-4 h-4 text-red-600 " />
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 w-80 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete?
            </h3>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>

              <button
                onClick={remove}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
