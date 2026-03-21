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

  return [...staticPages, ...repairPages];
}