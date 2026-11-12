"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${name}" işletmesini silmek istediğine emin misin?`)) {
      return;
    }

    setLoading(true);
    await fetch(`/api/businesses/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-muted transition-colors hover:text-danger disabled:opacity-50"
      aria-label={`${name} işletmesini sil`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
