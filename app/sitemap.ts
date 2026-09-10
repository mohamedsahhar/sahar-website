import { prisma } from "@/lib/prisma";

export default async function sitemap() {

  const baseUrl = "https://sa7arrepair.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/devices`,
      lastModified: new Date(),
    },
  ];

  // Dynamic repair pages (FROM DATABASE ✅)
  const repairs = await prisma.repairCase.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const repairPages = repairs.map((repair) => ({
    url: `${baseUrl}/cases/${repair.slug}`,
    lastModified: repair.updatedAt,
  }));

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      category: {
        isActive: true,
        isDeleted: false,
      },
      subcategory: {
        isActive: true,
        isDeleted: false,
      },
    },
    select: {
      slug: true,
      updatedAt: true,
      category: {
        select: {
          slug: true,
        },
      },
      subcategory: {
        select: {
          slug: true,
        },
      },
    },
  });

  const productPages = products.map((product) => ({
    url: `${baseUrl}/shop/${product.category.slug}/${product.subcategory.slug}/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  return [...staticPages, ...repairPages, ...productPages];
}
