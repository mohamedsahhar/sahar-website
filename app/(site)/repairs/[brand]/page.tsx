import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { notFound } from "next/navigation"
export const dynamic = "force-dynamic";

// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>
}) {

  const { brand } = await params

  const brandRecord = brand
    ? await prisma.brand.findUnique({ where: { slug: brand } })
    : null

  if (!brandRecord) {
    return {
      title: "Brand Repair",
      description: "Professional electronics repair services in Egypt.",
      robots: { index: false, follow: false },
    }
  }

  const formattedBrand = brandRecord.name

  const title = `${formattedBrand} Repair in New Cairo`

  const description = `Professional ${formattedBrand} repair in New Cairo, Egypt. We fix speakers, headphones, phones, and electronic devices with fast and reliable service at Sa7ar Quick Care.`

  return {
    title,
    description,

    alternates: {
      canonical: `/repairs/${brand}`,
    },

    openGraph: {
      title,
      description,
      url: `/repairs/${brand}`,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${formattedBrand} Repair`,
        },
      ],
    },
  }
}

// PAGE
export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>
}) {

  const { brand } = await params

  const brandRecord = brand
    ? await prisma.brand.findUnique({ where: { slug: brand } })
    : null

  if (!brandRecord) {
    notFound()
  }

  const formattedBrand = brandRecord.name

  const filteredCases = await prisma.repairCase.findMany({
    where: {
      device: {
        brandId: brandRecord.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      device: {
        include: {
          brand: true,
        },
      },
    },
  })

  const devices = await prisma.device.findMany({
    where: { brandId: brandRecord.id },
    orderBy: { name: "asc" },
  })

  const pageUrl = `https://www.sa7arrepair.com/repairs/${brandRecord.slug}`
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${formattedBrand} Repair Service`,
    serviceType: `${formattedBrand} device repair`,
    url: pageUrl,
    areaServed: { "@type": "City", name: "New Cairo" },
    provider: {
      "@type": "LocalBusiness",
      name: "Sa7ar Quick Care",
      url: "https://www.sa7arrepair.com",
      telephone: "+201021024094",
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Cairo",
        addressCountry: "EG",
      },
    },
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-10 py-16">
      <Script
        id={`brand-service-schema-${brandRecord.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/repairs" className="hover:text-gray-900 hover:underline">
          Repair Services
        </Link>{" "}/ {formattedBrand}
      </nav>

      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {formattedBrand} Repair Services
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional {formattedBrand} device repair in New Cairo. Explore the
          devices we support and real repairs completed by Sa7ar Quick Care.
        </p>
      </div>

      {devices.length > 0 && (
        <section className="mb-12" aria-labelledby="brand-devices">
          <h2 id="brand-devices" className="text-2xl font-semibold mb-5">
            {formattedBrand} Devices We Repair
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <Link
                key={device.id}
                href={`/devices/${device.slug}`}
                className="border rounded-xl p-4 bg-white hover:border-orange-400 hover:shadow-md transition"
              >
                <h3 className="font-semibold">{device.name} Repair</h3>
                <p className="mt-1 text-sm text-gray-500">View services and repair cases →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <h2 className="text-2xl font-semibold mb-5">
        Recent {formattedBrand} Repair Cases
      </h2>

      {filteredCases.length === 0 && (
        <p className="text-gray-500 text-center mb-12">
          No repairs found for this brand yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCases.map((repair: any) => (

          <Link
            key={repair.id}
            href={`/cases/${repair.slug}`}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
          >

            {repair.images?.[0] && (
  <Image
    src={repair.images[0]}
                alt={`${repair.device?.brand?.name} ${repair.device?.name} repair`}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">

              <h2 className="font-semibold text-lg mb-2">
                {repair.title}
              </h2>

              <p className="text-sm text-gray-500">
                {repair.device?.brand?.name} • {repair.device?.name}
              </p>

              {repair.repairTime && (
                <p className="text-sm text-gray-500 mt-1">
                  Repair time: {repair.repairTime}
                </p>
              )}

            </div>

          </Link>

        ))}

      </div>

      <div className="mt-12 rounded-xl bg-gray-100 p-6 text-center">
        <h2 className="text-xl font-semibold">Need help with a {formattedBrand} device?</h2>
        <p className="mt-2 text-gray-600">Tell us the model and problem, and our technicians will contact you.</p>
        <Link href="/repair-request" className="mt-4 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
          Request a Repair
        </Link>
      </div>

    </main>
  )
}
