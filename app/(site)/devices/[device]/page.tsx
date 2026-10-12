import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { notFound } from "next/navigation"
import { getDeviceDisplayName } from "@/lib/naming"
export const dynamic = "force-dynamic";

// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>
}) {

  const { device } = await params

  if (!device) {
    return {
      title: "Device Repair",
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
      title: "Device Not Found",
      description: "The requested device could not be found.",
      robots: { index: false, follow: false },
    }
  }

  const deviceName = getDeviceDisplayName(deviceData.brand.name, deviceData.name)

  const title = `${deviceName} Repair in New Cairo`

  const description = `Professional ${deviceName} repair in New Cairo, Egypt. We fix charging issues, battery problems, motherboard faults, and more with fast and reliable service at Sa7ar Quick Care.`

  return {
    title,
    description,

    alternates: {
      canonical: `/devices/${device}`,
    },

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
    notFound()
  }

  const deviceName = getDeviceDisplayName(deviceData.brand.name, deviceData.name)
  const pageUrl = `https://www.sa7arrepair.com/devices/${deviceData.slug}`
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${deviceName} Repair Service`,
    serviceType: `${deviceName} repair`,
    url: pageUrl,
    areaServed: { "@type": "City", name: "New Cairo" },
    provider: {
      "@type": "LocalBusiness",
      name: "Sa7ar Quick Care",
      url: "https://www.sa7arrepair.com",
      telephone: "+201021024094",
    },
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-10 py-16">
      <Script
        id={`device-service-schema-${deviceData.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/devices" className="hover:text-gray-900 hover:underline">Devices</Link>
        {" / "}
        <Link href={`/repairs/${deviceData.brand.slug}`} className="hover:text-gray-900 hover:underline">
          {deviceData.brand.name} Repairs
        </Link>
        {" / "}{deviceData.name}
      </nav>

      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {deviceName} Repair Services
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional {deviceName} repair in New Cairo for battery, charging,
          audio, motherboard, and other faults. Browse real work completed by
          Sa7ar Quick Care.
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

            {repair.images?.[0] && (
  <Image
    src={repair.images[0]}
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

      <div className="mt-12 rounded-xl bg-gray-100 p-6 text-center">
        <h2 className="text-xl font-semibold">Need your {deviceName} repaired?</h2>
        <p className="mt-2 text-gray-600">Send the model and fault details so our technicians can help.</p>
        <Link href="/repair-request" className="mt-4 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
          Request a Repair
        </Link>
      </div>

    </main>
  )
}
