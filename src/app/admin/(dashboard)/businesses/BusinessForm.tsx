"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatIban } from "@/lib/slug";

type Business = {
  id: string;
  name: string;
  accountName: string;
  bankName: string;
  iban: string;
  slug: string;
};

function normalizeIban(value: string): string {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.length === 0) return "";
  if (raw.startsWith("TR")) return raw.slice(0, 26);
  return ("TR" + raw.replace(/[^0-9]/g, "")).slice(0, 26);
}

export default function BusinessForm({
  business,
}: {
  business?: Business;
}) {
  const router = useRouter();
  const [name, setName] = useState(business?.name ?? "");
  const [accountName, setAccountName] = useState(business?.accountName ?? "");
  const [bankName, setBankName] = useState(business?.bankName ?? "");
  const [iban, setIban] = useState(business?.iban ?? "");
  const [slug, setSlug] = useState(business?.slug ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(business);

  function handleIbanFocus() {
    if (!iban) setIban("TR");
  }

  function handleIbanBlur() {
    if (iban === "TR") setIban("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEditing
      ? `/api/businesses/${business!.id}`
      : "/api/businesses";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, accountName, bankName, iban, slug }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Bir hata oluştu");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="max-w-lg rounded-xl border border-line bg-paper-raised p-6"
    >
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          İşletme adı
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/15"
          placeholder="Örn: Kahve Durağı"
          autoComplete="off"
          required
        />
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Hesap sahibi (ad soyad)
        </label>
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/15"
          placeholder="Örn: Ahmet Yılmaz"
          autoComplete="off"
          required
        />
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Banka
        </label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/15"
          placeholder="Örn: Yapı Kredi"
          autoComplete="off"
        />
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          IBAN
        </label>
        <input
          type="text"
          inputMode="text"
          value={formatIban(iban)}
          onChange={(e) => setIban(normalizeIban(e.target.value))}
          onFocus={handleIbanFocus}
          onBlur={handleIbanBlur}
          className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 font-mono text-sm tracking-wide text-ink outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/15"
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          autoComplete="off"
          spellCheck={false}
          required
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Sayfa adresi (slug)
        </label>
        <div className="flex items-center rounded-lg border border-line bg-paper-raised pl-3 transition-colors focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/15">
          <span className="text-sm text-muted">/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg bg-transparent px-1.5 py-2.5 font-mono text-sm text-ink outline-none"
            placeholder="boş bırakılırsa otomatik üretilir"
            autoComplete="off"
          />
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper-raised transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {loading ? "Kaydediliyor…" : isEditing ? "Güncelle" : "Oluştur"}
        </button>
      </div>
    </form>
  );
}
