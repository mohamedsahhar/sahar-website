import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function DevicesPage() {

  const devices = await prisma.device.findMany({
    include: {
      brand: true
    },
    orderBy: {
      name: "asc"
    }
  })

  const recentRepairs = await prisma.repairCase.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      device: {
        include: {
          brand: true
        }
      }
    }
  })

  return (
    <div className="max-w-5xl mx-auto">

      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-4">
        Devices We Repair
      </h1>

      <p className="text-gray-600 mb-10">
        At Sa7ar Quick Care we repair a wide range of electronic devices
        including headphones, speakers, smartphones, and Apple accessories.
        Browse the devices below to explore real repair cases from our workshop.
      </p>

      {/* Devices Section */}
      <h2 className="text-2xl font-semibold mb-6">
        Repairable Devices
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {devices.map((device) => (

          <Link
            key={device.id}
            href={`/devices/${device.slug}`}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >

            <h3 className="font-medium text-lg">
              {device.brand?.name} {device.name} Repair
            </h3>

          </Link>

        ))}
      </div>

      {/* Recent Repairs */}
      <h2 className="text-2xl font-semibold mb-6">
        Recent Repair Cases
      </h2>

      <div className="flex flex-col gap-4 mb-10">

        {recentRepairs.map((repair) => (

          <Link
            key={repair.slug}
            href={`/cases/${repair.slug}`}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >

            <h3 className="font-medium">
              {repair.title}
            </h3>

            <p className="text-sm text-gray-500">
              {repair.device?.brand?.name} • {repair.device?.name}
            </p>

          </Link>

        ))}

      </div>

      {/* CTA */}
      <div className="bg-gray-100 p-6 rounded-xl text-center">

        <h2 className="text-xl font-semibold mb-3">
          Need Your Device Repaired?
        </h2>

        <p className="text-gray-600 mb-4">
          Submit a repair request and our technicians will contact you quickly.
        </p>

        <Link
          href="/repair-request"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Request a Repair
        </Link>

      </div>

    </div>
  )
}