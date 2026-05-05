import ShopCatalog, { type ShopSearchParams } from "./ShopCatalog";

export const dynamic = "force-dynamic";

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
