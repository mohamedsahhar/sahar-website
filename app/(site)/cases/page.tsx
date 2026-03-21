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

      <p className="text-gray-500 text-center mb-6">
        Real repair cases from Sa7ar Quick Care workshop in New Cairo. 
        We specialize in phone repair, AirPods repair, JBL speaker repair, 
        Apple device repair, and electronics maintenance.
      </p>

      {/* ✅ SEO Content Boost */}
      <div className="max-w-3xl mx-auto text-gray-600 text-sm md:text-base text-center mb-10 space-y-3">
        <p>
          Browse real repair cases including iPhone repair, charging port repair, 
          battery replacement, motherboard repair, and speaker repair services.
        </p>
        <p>
          Our technicians handle a wide range of devices such as smartphones, 
          AirPods, JBL speakers, Apple Watches, and robot vacuum cleaners with 
          fast turnaround time and professional results.
        </p>
      </div>

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