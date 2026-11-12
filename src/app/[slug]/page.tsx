import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/db";
import { formatIban } from "@/lib/slug";
import CopyButton from "./CopyButton";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-white/8 bg-[#141B2E] p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B8DEF] text-lg font-bold text-[#0B1220]">
            ₺
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-[#7C8AAE]">
              Banka hesap bilgileri
            </p>
            <h1 className="truncate text-lg font-semibold text-white">
              {business.name}
            </h1>
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-1.5 text-xs font-medium tracking-wide text-[#7C8AAE]">
            Alıcı adı
          </p>
          <p className="mb-3 text-base font-semibold text-white">
            {business.accountName}
          </p>
          <CopyButton
            value={business.accountName}
            label="Adı kopyala"
            copiedLabel="Kopyalandı ✓"
            variant="secondary"
          />
        </div>

        {business.bankName && (
          <div className="mb-5">
            <p className="mb-1.5 text-xs font-medium tracking-wide text-[#7C8AAE]">
              Banka
            </p>
            <p className="text-base font-semibold text-white">
              {business.bankName}
            </p>
          </div>
        )}

        <div className="mb-6">
          <p className="mb-1.5 text-xs font-medium tracking-wide text-[#7C8AAE]">
            IBAN
          </p>
          <div className="rounded-2xl bg-[#0E1626] px-4 py-3.5">
            <p className="break-all font-mono text-base font-medium tracking-wide text-white">
              {formatIban(business.iban)}
            </p>
          </div>
        </div>

        <CopyButton
          value={business.iban}
          label="IBAN'ı kopyala"
          copiedLabel="Kopyalandı ✓"
        />

        <p className="mt-6 text-center text-sm text-[#5B6380]">
          Teşekkür ederiz!
        </p>
      </div>
    </div>
  );
}
