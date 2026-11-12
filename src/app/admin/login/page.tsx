"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NfcMark from "@/components/NfcMark";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Giriş başarısız");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-sm rounded-xl border border-line bg-paper-raised p-8 shadow-[0_1px_2px_rgba(18,22,28,0.04)]"
      >
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper-raised">
            <NfcMark className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">NFC Admin</p>
            <p className="text-xs text-muted">İşletme sayfalarını yönet</p>
          </div>
        </div>

        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Kullanıcı adı
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/15"
          autoComplete="off"
          required
        />

        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Şifre
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/15"
          autoComplete="off"
          required
        />

        {error && (
          <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-medium text-paper-raised transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
