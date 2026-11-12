import { notFound } from "next/navigation";
import { getBusinessById } from "@/lib/db";
import BusinessForm from "../BusinessForm";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = getBusinessById(id);

  if (!business) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-ink">
        İşletmeyi düzenle
      </h1>
      <BusinessForm business={business} />
    </div>
  );
}
