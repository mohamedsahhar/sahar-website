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

  const formattedBrand =
    brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()

  const title = `${formattedBrand} Repair Services | Sa7ar Quick Care`

  const description = `Professional ${formattedBrand} repair services in Egypt. We fix phones, speakers, AirPods, and more with fast turnaround and trusted quality at Sa7ar Quick Care.`

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

  if (!brand) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">
          Invalid brand.
        </p>
      </main>
    )
  }

  // ✅ SAFE FIX: normalize first letter
  const formattedBrand =
    brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()

  const filteredCases = await prisma.repairCase.findMany({
    where: {
      device: {
        brand: {
          name: formattedBrand,
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
          {formattedBrand} Repair Services
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional {formattedBrand} device repair services at Sa7ar Quick Care.
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

            {repair.image && (
              <Image
                src={repair.image}
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