import ShopCatalog, { type ShopSearchParams } from "./ShopCatalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electronics Parts and Accessories Shop",
  description:
    "Browse electronics parts, replacement items, and accessories from Sa7ar Quick Care in Egypt.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  return (
    <ShopCatalog
      searchParams={searchParams}
      basePath="/shop"
      eyebrow="SA7AR Shop"
      title="Products for repair, replacement, and upgrades"
      clearHref="/shop"
      showFeaturedSection
    />
  );
}
