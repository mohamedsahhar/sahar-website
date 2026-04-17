import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic";

// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>
}) {

  const { brand } = await params

  if (!brand) {
    return {
      title: "Brand Repair | Sa7ar Quick Care",
      description: "Professional electronics repair services in Egypt.",
    }
  }

  // ✅ FIX: decode URL
  const decodedBrand = decodeURIComponent(brand)

  const displayBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1)

  const title = `${displayBrand} Repair in New Cairo | Sa7ar Quick Care`

  const description = `Professional ${displayBrand} repair in New Cairo, Egypt. We fix speakers, headphones, phones, and electronic devices with fast and reliable service at Sa7ar Quick Care.`

  return {
    title,
    description,

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
          alt: `${displayBrand} Repair`,
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

  if (!brand) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">
          Invalid brand.
        </p>
      </main>
    )
  }

  // ✅ FIX: decode URL
  const decodedBrand = decodeURIComponent(brand)

  const displayBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1)

  const filteredCases = await prisma.repairCase.findMany({
    where: {
      device: {
        brand: {
          name: {
            equals: decodedBrand,
            mode: "insensitive",
          },
        },
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

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-10 py-16">

      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {displayBrand} Repair Services
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional {displayBrand} device repair services at Sa7ar Quick Care.
        </p>
      </div>

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

    </main>
  )
}