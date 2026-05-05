import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShopCatalog, { type ShopSearchParams } from "../ShopCatalog";

export const dynamic = "force-dynamic";

type CategoryPageParams = Promise<{
  category: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: CategoryPageParams;
}) {
  const { category } = await params;

  const categoryRecord = await prisma.category.findUnique({
    where: { slug: category },
  });

  if (
    !categoryRecord ||
    !categoryRecord.isActive ||
    categoryRecord.isDeleted
  ) {
    return {
      title: "Shop Category | Sa7ar Quick Care",
    };
  }

  const title = `${categoryRecord.name} | Sa7ar Quick Care Shop`;
  const description = `Browse ${categoryRecord.name} products from Sa7ar Quick Care. Ask directly on WhatsApp for availability and shipping in Egypt.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${categoryRecord.slug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: CategoryPageParams;
  searchParams: ShopSearchParams;
}) {
  const { category } = await params;

  const categoryRecord = await prisma.category.findUnique({
    where: { slug: category },
  });

  if (
    !categoryRecord ||
    !categoryRecord.isActive ||
    categoryRecord.isDeleted
  ) {
    notFound();
  }

  return (
    <ShopCatalog
      searchParams={searchParams}
      basePath={`/shop/${categoryRecord.slug}`}
      eyebrow="SA7AR Shop"
      title={`${categoryRecord.name} products`}
      clearHref={`/shop/${categoryRecord.slug}`}
      routeCategorySlug={categoryRecord.slug}
    />
  );
}
