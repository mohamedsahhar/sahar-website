import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminCases() {

  const cases = await prisma.repairCase.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Repair Cases
      </h1>

      <div className="mb-8">
        <Link
          href="/admin/cases/new"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Add New Case
        </Link>
      </div>

      <div className="space-y-4">

        {cases.length === 0 && (
          <p className="text-gray-500">
            No repair cases yet.
          </p>
        )}

        {cases.map((c: any)=>(
          <div
            key={c.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >

            <div>
              <p className="font-semibold">
                {c.title}
              </p>

              <p className="text-gray-500 text-sm">
                {c.brand} {c.device}
              </p>
            </div>

            <Link
              href={`/cases/${c.slug}`}
              className="text-blue-600 hover:underline"
            >
              View
            </Link>

          </div>
        ))}

      </div>

    </div>
  )
}