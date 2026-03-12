import Link from "next/link"
import Image from "next/image"
import { cases } from "@/data/cases"

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>
}) {

  const { brand } = await params

  const brandCases = cases.filter(
    (repair) => repair.brand.toLowerCase() === brand.toLowerCase()
  )

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        {brand.toUpperCase()} Repair Services
      </h1>

      <p className="text-gray-600 mb-10">
        Professional {brand} device repair services at Sa7ar Quick Care.
        Explore real repair cases and expert solutions performed in our workshop.
      </p>

      {brandCases.length === 0 && (
        <p className="text-gray-500">No repairs found for this brand.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {brandCases.map((repair) => (

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
                Device: {repair.device}
              </p>

              <p className="text-sm text-gray-500">
                Repair time: {repair.repairTime}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>
  )
}