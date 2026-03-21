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
  }) as any

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-10 py-16">

      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-4 text-center">
        Devices We Repair
      </h1>

      <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        At Sa7ar Quick Care we repair a wide range of electronic devices
        including headphones, speakers, smartphones, and Apple accessories.
      </p>

      {/* Devices Section */}
      <h2 className="text-2xl font-semibold mb-6">
        Repairable Devices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

        {devices.map((device) => (

          <Link
            key={device.id}
            href={`/devices/${device.slug}`}
            className="border rounded-xl p-5 hover:shadow-md transition bg-white"
          >

            <h3 className="font-semibold text-lg">
              {device.brand?.name} {device.name}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View repair cases →
            </p>

          </Link>

        ))}

      </div>

      {/* Recent Repairs */}
      <h2 className="text-2xl font-semibold mb-6">
        Recent Repair Cases
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

        {recentRepairs.map((repair: any) => (

          <Link
            key={repair.id}
            href={`/cases/${repair.slug}`}
            className="border rounded-xl p-5 hover:shadow-md transition bg-white"
          >

            <h3 className="font-semibold">
              {repair.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
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

    </main>
  )
}
