import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>
}) {

  const { device } = await params

  if (!device) {
    return {
      title: "Device Repair | Sa7ar Quick Care",
      description: "Professional electronics repair services in Egypt.",
    }
  }

  const deviceData = await prisma.device.findUnique({
    where: { slug: device },
    include: {
      brand: true,
    },
  })

  if (!deviceData) {
    return {
      title: "Device Not Found | Sa7ar Quick Care",
      description: "The requested device could not be found.",
    }
  }

  const deviceName = `${deviceData.brand.name} ${deviceData.name}`

  const title = `${deviceName} Repair Services | Sa7ar Quick Care`

  const description = `Professional repair services for ${deviceName} in Egypt. We fix common issues, provide fast turnaround, and ensure high-quality results at Sa7ar Quick Care.`

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `/devices/${device}`,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: deviceName,
        },
      ],
    },
  }
}

// PAGE
export default async function DevicePage({
  params,
}: {
  params: Promise<{ device: string }>
}) {

  const { device } = await params

  if (!device) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">
          Invalid device.
        </p>
      </main>
    )
  }

  const deviceData = await prisma.device.findUnique({
    where: {
      slug: device,
    },
    include: {
      brand: true,
      repairs: true,
    },
  })

  if (!deviceData) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">
          Device not found.
        </p>
      </main>
    )
  }

  const deviceName = `${deviceData.brand.name} ${deviceData.name}`

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-10 py-16">

      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {deviceName} Repair Services
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional repair services for {deviceName} devices at Sa7ar Quick Care.
        </p>
      </div>

      {deviceData.repairs.length === 0 && (
        <p className="text-gray-500 text-center mb-12">
          No repairs found for this device yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

        {deviceData.repairs.map((repair) => (

          <Link
            key={repair.id}
            href={`/cases/${repair.slug}`}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
          >

            {repair.image && (
              <Image
                src={repair.image}
                alt={repair.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">

              <h2 className="font-semibold text-lg mb-2">
                {repair.title}
              </h2>

              {repair.repairTime && (
                <p className="text-sm text-gray-500">
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