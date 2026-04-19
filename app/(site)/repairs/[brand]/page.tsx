import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

//////////////////////////////////////////////////////
// SEO
//////////////////////////////////////////////////////
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

  const decodedBrand = decodeURIComponent(brand)

  const displayBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1)

  const title = `${displayBrand} Repair in New Cairo | Sa7ar Quick Care`

  const description = `Professional ${displayBrand} repair in New Cairo, Egypt. We fix speakers, headphones, phones, and electronic devices with fast and reliable service at Sa7ar Quick Care.`

  return {
    title,
    description,
  }
}

//////////////////////////////////////////////////////
// PAGE
//////////////////////////////////////////////////////
export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>
}) {
  const { brand } = await params

  if (!brand) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Invalid brand.</p>
      </main>
    )
  }

  const decodedBrand = decodeURIComponent(brand)

  const displayBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1)

  const filteredCases = await prisma.repairCase.findMany({
    where: {
      device: {
        brand: {
          slug: decodedBrand.toLowerCase(),
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

      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/repairs"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
        >
          ← Back to Brands
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {displayBrand} Repair Services
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional {displayBrand} device repair services at Sa7ar Quick Care.
        </p>
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <p className="text-gray-500 text-center mb-12">
          No repairs found for this brand yet.
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCases.map((repair: any) => (
          <Link
            key={repair.id}
            href={`/cases/${repair.slug}`}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
          >

            {repair.images?.[0] && (
              <div className="relative w-full h-48">
                <Image
                  src={repair.images[0]}
                  alt={`${repair.device?.brand?.name} ${repair.device?.name} repair`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
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