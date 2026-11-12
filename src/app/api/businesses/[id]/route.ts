import { NextRequest, NextResponse } from "next/server";
import {
  deleteBusiness,
  getBusinessById,
  getBusinessBySlug,
  updateBusiness,
} from "@/lib/db";
import { ibanLooksValid, slugify } from "@/lib/slug";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const business = getBusinessById(id);
  if (!business) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(business);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!getBusinessById(id)) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

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

  const existing = getBusinessBySlug(slug);
  if (existing && existing.id !== id) {
    return NextResponse.json(
      { error: `"${slug}" slug'ı zaten kullanılıyor` },
      { status: 409 }
    );
  }

  const business = updateBusiness(id, {
    name,
    accountName,
    bankName,
    iban: iban.replace(/\s+/g, "").toUpperCase(),
    slug,
  });

  return NextResponse.json(business);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteBusiness(id);
  return NextResponse.json({ ok: true });
}
