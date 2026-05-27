import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import ProductGallery from "./ProductGallery";

export const dynamic = "force-dynamic";

type ProductPageParams = Promise<{
  category: string;
  subcategory: string;
  slug: string;
}>;

function getSchemaCondition(condition: string) {
  const normalized = condition.toLowerCase();

  if (normalized.includes("used")) {
    return "https://schema.org/UsedCondition";
  }

  if (normalized.includes("refurbished")) {
    return "https://schema.org/RefurbishedCondition";
  }

  return "https://schema.org/NewCondition";
}

function getSchemaAvailability(stockStatus: string) {
  return stockStatus.toLowerCase() === "available"
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export async function generateMetadata({
  params,
}: {
  params: ProductPageParams;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
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
    include: {
      brand: true,
      category: true,
      subcategory: true,
    },
  });

  if (!product) {
    return {
      title: "Product | Sa7ar Quick Care",
    };
  }

  const title =
    product.seoTitle || `${product.title} | Sa7ar Quick Care Shop`;
  const description =
    product.seoDescription ||
    `${product.title} from ${product.brand.name}. ${product.description.slice(
      0,
      130
    )}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${product.category.slug}/${product.subcategory.slug}/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: ProductPageParams;
}) {
  const { category, subcategory, slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
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
    include: {
      brand: true,
      category: true,
      subcategory: true,
      device: true,
    },
  });

  if (
    !product ||
    product.category.slug !== category ||
    product.subcategory.slug !== subcategory
  ) {
    notFound();
  }

  const productPath = `/shop/${product.category.slug}/${product.subcategory.slug}/${product.slug}`;
  const productUrl = `https://www.sa7arrepair.com${productPath}`;
  const galleryImages = product.images || [];

  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in ${product.title} (${product.brand.name})
Product link: ${productUrl}`
  );

  const isAvailable = product.stockStatus.toLowerCase() === "available";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seoDescription || product.description,
    image: galleryImages,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    category: `${product.category.name} / ${product.subcategory.name}`,
    itemCondition: getSchemaCondition(product.condition),
    url: productUrl,
    seller: {
      "@type": "Organization",
      name: "Sa7ar Quick Care",
      url: "https://www.sa7arrepair.com",
      telephone: "+201021024094",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      availability: getSchemaAvailability(product.stockStatus),
      itemCondition: getSchemaCondition(product.condition),
      seller: {
        "@type": "Organization",
        name: "Sa7ar Quick Care",
      },
    },
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 pt-5 pb-28 md:py-10">
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <nav className="mb-5 text-sm text-gray-500 flex flex-wrap items-center gap-2">
        <Link href="/shop" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/shop/${product.category.slug}`}
          className="hover:text-gray-900 transition"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <Link
          href={`/shop/${product.category.slug}/${product.subcategory.slug}`}
          className="hover:text-gray-900 transition"
        >
          {product.subcategory.name}
        </Link>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.85fr)] gap-7 lg:gap-10 items-start">
        <div className="w-full min-w-0">
          <ProductGallery images={galleryImages} title={product.title} />
        </div>

        <div className="w-full min-w-0 lg:sticky lg:top-24 self-start rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-semibold">
              {product.brand.name}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-xs font-semibold">
              {product.condition}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stockStatus}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-950 leading-tight mb-4">
            {product.title}
          </h1>

          {product.device && (
            <p className="text-sm text-gray-500 mb-5">
              Compatible with {product.device.name}
            </p>
          )}

          <div className="mb-7">
            <p className="text-gray-700 leading-7 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <a
            href={`https://wa.me/201021024094?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-600 text-white py-3.5 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Ask on WhatsApp
          </a>

          <div className="mt-7 border-t border-gray-200 pt-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-950 mb-2">
                Shipping
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.shippingInfo || "Shipping details available on request."}
              </p>
            </div>

            {product.colors.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-950 mb-3">
                  Available Colors
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                    >
                      {color.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-3 md:hidden">
        <a
          href={`https://wa.me/201021024094?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          Ask on WhatsApp
        </a>
      </div>
    </main>
  );
}