import Link from "next/link";
import Image from "next/image";
import { PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isSmartSearchMatch } from "@/lib/search";
import ShopFilters from "./ShopFilters";
import ShopProductsClient from "./ShopProductsClient";

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

  const [rawProducts, brands, categories] = await Promise.all([
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
  where: {
    products: {
      some: {
        isActive: true,
        isDeleted: false,
      },
    },
  },
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

  const products = query
    ? rawProducts.filter((product) =>
        isSmartSearchMatch(
          query,
          [
            product.title,
            product.slug,
            product.brand?.name,
            product.category?.name,
            product.subcategory?.name,
            product.condition,
          ]
            .filter(Boolean)
            .join(" ")
        )
      )
    : rawProducts;

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
        <ShopProductsClient products={products} />
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
