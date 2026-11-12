import { NextRequest, NextResponse } from "next/server";
import { createBusiness, getBusinessBySlug, listBusinesses } from "@/lib/db";
import { ibanLooksValid, slugify } from "@/lib/slug";

export async function GET() {
  return NextResponse.json(listBusinesses());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const accountName = String(body.accountName ?? "").trim();
  const bankName = String(body.bankName ?? "").trim();
  const iban = String(body.iban ?? "").trim();
  const slugInput = String(body.slug ?? "").trim();

  if (!name || !accountName || !iban) {
    return NextResponse.json(
      { error: "İşletme adı, ad soyad ve IBAN zorunludur" },
      { status: 400 }
    );
  }

  if (!ibanLooksValid(iban)) {
    return NextResponse.json(
      { error: "IBAN formatı geçersiz görünüyor" },
      { status: 400 }
    );
  }

  const slug = slugify(slugInput || name);
  if (!slug) {
    return NextResponse.json(
      { error: "Geçerli bir slug oluşturulamadı" },
      { status: 400 }
    );
  }

  if (getBusinessBySlug(slug)) {
    return NextResponse.json(
      { error: `"${slug}" slug'ı zaten kullanılıyor` },
      { status: 409 }
    );
  }

  const business = createBusiness({
    name,
    accountName,
    bankName,
    iban: iban.replace(/\s+/g, "").toUpperCase(),
    slug,
  });

  return NextResponse.json(business, { status: 201 });
}
