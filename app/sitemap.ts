import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const pathSegment = (value: string) => encodeURIComponent(value);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sa7arrepair.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cases`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/devices`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/repairs`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/repair-request`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    },
  ];

  const [brands, devices, repairs, categories, subcategories, products] =
    await Promise.all([
      prisma.brand.findMany({ select: { slug: true } }),
      prisma.device.findMany({ select: { slug: true } }),
      prisma.repairCase.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true, isDeleted: false },
        select: { slug: true },
      }),
      prisma.subcategory.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          category: { isActive: true, isDeleted: false },
        },
        select: { slug: true, category: { select: { slug: true } } },
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          category: { isActive: true, isDeleted: false },
          subcategory: { isActive: true, isDeleted: false },
        },
        select: {
          slug: true,
          updatedAt: true,
          category: { select: { slug: true } },
          subcategory: { select: { slug: true } },
        },
      }),
    ]);

  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/repairs/${pathSegment(brand.slug)}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const devicePages = devices.map((device) => ({
    url: `${baseUrl}/devices/${pathSegment(device.slug)}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic repair pages (FROM DATABASE ✅)
  const repairPages = repairs.map((repair) => ({
    url: `${baseUrl}/cases/${pathSegment(repair.slug)}`,
    lastModified: repair.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/shop/${pathSegment(category.slug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const subcategoryPages = subcategories.map((subcategory) => ({
    url: `${baseUrl}/shop/${pathSegment(subcategory.category.slug)}/${pathSegment(subcategory.slug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/shop/${pathSegment(product.category.slug)}/${pathSegment(product.subcategory.slug)}/${pathSegment(product.slug)}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...brandPages,
    ...devicePages,
    ...repairPages,
    ...categoryPages,
    ...subcategoryPages,
    ...productPages,
  ];
}
