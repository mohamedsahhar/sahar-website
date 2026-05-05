import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShopCatalog, { type ShopSearchParams } from "../../ShopCatalog";

export const dynamic = "force-dynamic";

type SubcategoryPageParams = Promise<{
  category: string;
  subcategory: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: SubcategoryPageParams;
}) {
  const { category, subcategory } = await params;

  const subcategoryRecord = await prisma.subcategory.findFirst({
    where: {
      slug: subcategory,
      isActive: true,
      isDeleted: false,
      category: {
        slug: category,
        isActive: true,
        isDeleted: false,
      },
    },
    include: {
      category: true,
    },
  });

  if (!subcategoryRecord) {
    return {
      title: "Shop Subcategory | Sa7ar Quick Care",
    };
  }

  const title = `${subcategoryRecord.name} ${subcategoryRecord.category.name} | Sa7ar Quick Care Shop`;
  const description = `Browse ${subcategoryRecord.name} products in ${subcategoryRecord.category.name}. Ask Sa7ar Quick Care directly on WhatsApp for availability and shipping.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${subcategoryRecord.category.slug}/${subcategoryRecord.slug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: SubcategoryPageParams;
  searchParams: ShopSearchParams;
}) {
  const { category, subcategory } = await params;

  const subcategoryRecord = await prisma.subcategory.findFirst({
    where: {
      slug: subcategory,
      isActive: true,
      isDeleted: false,
      category: {
        slug: category,
        isActive: true,
        isDeleted: false,
      },
    },
    include: {
      category: true,
    },
  });

  if (!subcategoryRecord) notFound();

  return (
    <ShopCatalog
      searchParams={searchParams}
      basePath={`/shop/${subcategoryRecord.category.slug}/${subcategoryRecord.slug}`}
      eyebrow={`${subcategoryRecord.category.name} / ${subcategoryRecord.name}`}
      title={`${subcategoryRecord.name} products`}
      clearHref={`/shop/${subcategoryRecord.category.slug}/${subcategoryRecord.slug}`}
      routeCategorySlug={subcategoryRecord.category.slug}
      routeSubcategorySlug={subcategoryRecord.slug}
    />
  );
}
