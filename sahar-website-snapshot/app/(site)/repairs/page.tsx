import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { RepairCase } from "@prisma/client"

export default async function RepairsPage() {

  const repairs: RepairCase[] = await prisma.repairCase.findMany({
    orderBy: { id: "desc" }
  })

  const brandMap: Record<string, number> = {}

  repairs.forEach((repair) => {
    const brand = repair.brand
    brandMap[brand] = (brandMap[brand] || 0) + 1
  })

  const brands = Object.keys(brandMap).sort()

  const recentRepairs = repairs.slice(0, 4)

  return (
    <div className="max-w-5xl mx-auto">

      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-4">
        Device Repair Services
      </h1>

      <p className="text-gray-600 mb-10">
        Sa7ar Quick Care provides professional repair services for smartphones,
        headphones, speakers, Apple devices, and many other electronics.
        Browse repair brands or explore real repair cases completed in our workshop.
      </p>

      {/* Brands Section */}
      <h2 className="text-2xl font-semibold mb-6">
        Brands We Repair
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-12">

        {brands.map((brand) => (

          <Link
            key={brand}
            href={`/repairs/${brand.toLowerCase()}`}
            className="border rounded-lg p-5 hover:shadow-md transition bg-white"
          >

            <h3 className="font-medium text-lg mb-1">
              {brand} Repair
            </h3>

            <p className="text-sm text-gray-500">
              {brandMap[brand]} repair cases
            </p>

          </Link>

        ))}

      </div>

      {/* Recent Repair Cases */}
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
              {repair.brand} • {repair.device}
            </p>

          </Link>

        ))}

      </div>

      {/* CTA */}
      <div className="bg-gray-100 p-6 rounded-xl text-center">

        <h2 className="text-xl font-semibold mb-3">
          Need a Repair?
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