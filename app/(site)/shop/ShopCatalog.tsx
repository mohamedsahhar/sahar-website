import Link from "next/link";
import Image from "next/image";
import { MessageCircle, PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ShopFilters from "./ShopFilters";

export type ShopSearchParams = Promise<{
  q?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
}>;

function normalizeFilter(value?: string) {
  return value?.trim() || undefined;
}

export default async function ShopCatalog({
  searchParams,
  basePath,
  eyebrow,
  title,
  clearHref,
  showFeaturedSection = false,
  routeCategorySlug,
  routeSubcategorySlug,
}: {
  searchParams: ShopSearchParams;
  basePath: string;
  eyebrow: string;
  title: string;
  clearHref: string;
  showFeaturedSection?: boolean;
  routeCategorySlug?: string;
  routeSubcategorySlug?: string;
}) {
  const filters = await searchParams;
  const query = normalizeFilter(filters.q);
  const brandSlug = normalizeFilter(filters.brand);
  const categorySlug = routeCategorySlug || normalizeFilter(filters.category);
  const subcategorySlug =
    routeSubcategorySlug || normalizeFilter(filters.subcategory);

  const where = {
    isActive: true,
    isDeleted: false,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { slug: { contains: query, mode: "insensitive" as const } },
            {
              brand: {
                name: { contains: query, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
    ...(brandSlug ? { brand: { slug: brandSlug } } : {}),
    category: {
      ...(categorySlug ? { slug: categorySlug } : {}),
      isActive: true,
      isDeleted: false,
    },
    subcategory: {
      ...(subcategorySlug ? { slug: subcategorySlug } : {}),
      isActive: true,
      isDeleted: false,
    },
  };

  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        subcategory: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      orderBy: { name: "asc" },
      include: {
        subcategories: {
          where: {
            isActive: true,
            isDeleted: false,
          },
          orderBy: { name: "asc" },
        },
      },
    }),
  ]);

  const showFeatured =
    showFeaturedSection &&
    !query &&
    !brandSlug &&
    !categorySlug &&
    !subcategorySlug;

  const featuredProducts = showFeatured
    ? products.filter((product) => product.featured).slice(0, 4)
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-28 md:py-10">
      <section className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700 mb-2">
              {eyebrow}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
              {title}
            </h1>
          </div>
          <div className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-white">
            <PackageSearch size={23} aria-hidden="true" />
          </div>
        </div>
      </section>

      <ShopFilters
        brands={brands}
        categories={categories}
        basePath={basePath}
        lockedCategory={routeCategorySlug}
        lockedSubcategory={routeSubcategorySlug}
        currentFilters={{
          q: query || "",
          brand: brandSlug || "",
          category: categorySlug || "",
          subcategory: subcategorySlug || "",
        }}
      />

      {featuredProducts.length > 0 && (
        <section className="mt-7 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-700">
                Featured
              </p>
              <h2 className="text-xl font-bold text-gray-950">
                Recommended products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {featuredProducts.map((product) => {
              const productHref = `/shop/${product.category.slug}/${product.subcategory.slug}/${product.slug}`;
              const primaryImage = product.images[0];

              return (
                <Link
                  key={product.id}
                  href={productHref}
                  className="group grid grid-cols-[88px_1fr] gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-white">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product.title}
                        fill
                        sizes="88px"
                        className="object-cover transition group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                      Featured
                    </span>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-gray-950">
                      {product.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {product.brand.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-7 mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        {(query || brandSlug || filters.category || filters.subcategory) && (
          <Link
            href={clearHref}
            className="text-sm font-medium text-gray-900 underline underline-offset-4"
          >
            Clear filters
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => {
            const productHref = `/shop/${product.category.slug}/${product.subcategory.slug}/${product.slug}`;
            const productUrl = `https://www.sa7arrepair.com${productHref}`;
            const whatsappMessage = encodeURIComponent(
              `Hello, I'm interested in ${product.title} (${product.brand.name})
Product link: ${productUrl}`
            );
            const isAvailable =
              product.stockStatus.toLowerCase() === "available";
            const primaryImage = product.images[0];

            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link
                  href={productHref}
                  className="relative block aspect-[4/3] bg-gray-100 overflow-hidden"
                >
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={product.title}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {product.featured && (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                        Featured
                      </span>
                    )}
                    <span className="inline-flex rounded-full bg-gray-950 px-2.5 py-1 text-xs font-semibold text-white">
                      {product.brand.name}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stockStatus}
                    </span>
                  </div>

                  <Link href={productHref}>
                    <h2 className="min-h-[48px] text-base font-semibold leading-6 text-gray-950 transition group-hover:text-green-700">
                      {product.title}
                    </h2>
                  </Link>

                  <p className="mt-2 text-sm text-gray-500">
                    {product.category.name} / {product.subcategory.name}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {product.condition}
                  </p>

                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <Link
                      href={productHref}
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      View details
                    </Link>
                    <a
                      href={`https://wa.me/201021024094?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-600 text-white transition hover:bg-green-700"
                      aria-label={`Ask about ${product.title} on WhatsApp`}
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-lg border border-gray-200 bg-white px-5 py-12 text-center">
          <PackageSearch
            size={34}
            aria-hidden="true"
            className="mx-auto mb-3 text-gray-400"
          />
          <h2 className="text-lg font-semibold text-gray-950">
            No products found
          </h2>
          <p className="mt-2 text-gray-600">
            Try changing the search or filters.
          </p>
        </section>
      )}
    </main>
  );
}
