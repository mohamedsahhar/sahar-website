import { prisma } from "@/lib/prisma";
import CasesClient from "./CasesClient";

export const dynamic = "force-dynamic";

export default async function CasesPage() {

  const rawCases = await prisma.repairCase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      device: {
        include: {
          brand: true
        }
      }
    }
  });

  const cases = rawCases.map((repair) => ({
    ...repair,
    thumbnail: repair.images?.[0] || null,
  }));

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

      {/* SEO Content */}
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

      {/* 🔥 Browse Section (FINAL) */}
      <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">

        {/* Devices */}
        <div className="border rounded-xl p-6 hover:shadow-md transition text-center">
          <h2 className="text-lg font-semibold mb-2">Browse by Device</h2>
          <p className="text-gray-500 text-sm mb-4">
            Find your device and see available repairs.
          </p>
          <a href="/devices" className="text-black font-medium underline">
            View Devices
          </a>
        </div>

        {/* Brands */}
        <div className="border rounded-xl p-6 hover:shadow-md transition text-center">
          <h2 className="text-lg font-semibold mb-2">Browse by Brand</h2>
          <p className="text-gray-500 text-sm mb-4">
            Explore repairs based on brand categories.
          </p>
          <a href="/repairs" className="text-black font-medium underline">
            View Brands
          </a>
        </div>

      </div>

      {cases.length === 0 && (
        <p className="text-center text-gray-500">
          No repair cases available yet.
        </p>
      )}

      {/* Cases List */}
      <div id="cases">
        <CasesClient cases={cases} />
      </div>

    </main>
  );
}