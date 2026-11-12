import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { listBusinesses, type Business } from "@/lib/db";
import NfcMark from "@/components/NfcMark";
import DeleteButton from "./DeleteButton";

export default async function AdminHomePage() {
  const businesses = listBusinesses();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-medium text-ink">İşletmeler</h1>
          <p className="mt-1 text-sm text-muted">
            {businesses.length > 0
              ? `${businesses.length} işletme sayfası yayında`
              : "Henüz işletme eklenmedi"}
          </p>
        </div>
        <Link
          href="/admin/businesses/new"
          className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper-raised transition-colors hover:bg-ink-soft"
        >
          <Plus className="h-4 w-4" />
          Yeni işletme
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line py-16 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-muted">
            <NfcMark className="h-5 w-5" />
          </span>
          <p className="text-sm text-muted">
            İlk işletmeni ekleyince sayfası burada listelenir.
          </p>
          <Link
            href="/admin/businesses/new"
            className="text-sm font-medium text-signal hover:text-signal-bright"
          >
            Yeni işletme ekle
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper-raised">
          {businesses.map((business: Business) => (
            <li
              key={business.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-signal">
                <NfcMark className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {business.name}
                </p>
                <p className="truncate text-sm text-muted">
                  {business.accountName}
                </p>
              </div>

              <Link
                href={`/${business.slug}`}
                target="_blank"
                className="hidden items-center gap-1 text-sm text-signal hover:text-signal-bright sm:flex"
              >
                /{business.slug}
                <ExternalLink className="h-3 w-3" />
              </Link>

              <div className="flex shrink-0 items-center gap-4 pl-2">
                <Link
                  href={`/admin/businesses/${business.id}`}
                  className="text-sm text-muted hover:text-ink"
                >
                  Düzenle
                </Link>
                <DeleteButton id={business.id} name={business.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
