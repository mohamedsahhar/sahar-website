import { prisma } from "@/lib/prisma"
import CasesClient from "./CasesClient"

export default async function CasesPage() {

  const cases = await prisma.repairCase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      device: {
        include: {
          brand: true
        }
      }
    }
  })

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-10 py-16">

      <h1 className="text-3xl font-bold text-center mb-4">
        Repair Cases
      </h1>

      <p className="text-gray-500 text-center mb-10">
        Real repair cases from Sa7ar Quick Care workshop
      </p>

      {cases.length === 0 && (
        <p className="text-center text-gray-500">
          No repair cases available yet.
        </p>
      )}

      {/* ✅ ONLY pass cases */}
      <CasesClient cases={cases} />

    </main>
  )
}