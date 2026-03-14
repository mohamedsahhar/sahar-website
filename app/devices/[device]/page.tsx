import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { RepairCase } from "@prisma/client"

export default async function DevicePage({
  params,
}: {
  params: Promise<{ device: string }>
}) {

  const { device } = await params

  const deviceName = device.replace(/-/g, " ")

const filteredCases: RepairCase[] = await prisma.repairCase.findMany({
  where: {
    slug: {
      contains: device,
    },
  },
})

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        {deviceName.toUpperCase()} Repair Services
      </h1>

      <p className="text-gray-600 mb-10">
        Professional repair services for {deviceName} devices at Sa7ar Quick Care.
        Browse real repair cases completed in our workshop.
      </p>

      {filteredCases.length === 0 && (
        <p className="text-gray-500">No repairs found for this device.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-12">

        {filteredCases.map((repair) => (

          <Link
            key={repair.slug}
            href={`/cases/${repair.slug}`}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition"
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

              <p className="text-sm text-gray-500">
                Brand: {repair.brand}
              </p>

              {repair.repairTime && (
                <p className="text-sm text-gray-500">
                  Repair time: {repair.repairTime}
                </p>
              )}

            </div>

          </Link>

        ))}

      </div>

      <div className="bg-gray-100 p-6 rounded-xl text-center">

        <h2 className="text-xl font-semibold mb-3">
          Need Your {deviceName} Repaired?
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