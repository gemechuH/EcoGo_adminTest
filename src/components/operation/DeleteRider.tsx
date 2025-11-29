"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Button } from "../ui/button";
import { Trash, Loader2, Trash2 } from "lucide-react";

export default function DeleteRider({ rider, onDeleted }: any) {
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    if (!confirm("Delete this rider?")) return;

    setLoading(true);
    const res = await fetch(`/api/riders/${rider.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      onDeleted();
    } else {
      alert(data.error);
    }
  };

  return (
    <Button size="sm" variant="destructive" onClick={remove}>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 text-red-400" />
      )}
    </Button>
  );
}
