"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export default function ShopProductsClient({ products }: { products: any[] }) {
  const [visibleCount, setVisibleCount] = useState(8);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {visibleProducts.map((product) => {
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

      {visibleCount < products.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-6 py-3 border rounded-2xl"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}