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

  // ✅ ADD THUMBNAIL FROM images[]
  const cases = rawCases.map((repair) => ({
    ...repair,
    thumbnail: repair.images?.[0] || null,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Repair Cases
      </h1>

      <p className="max-w-4xl mx-auto text-gray-600 text-center mb-6">
        Explore real repairs completed by Sa7ar Quick Care, then search by
        brand, device, problem, or solution to find the closest match.
      </p>

      {cases.length === 0 && (
        <p className="text-center text-gray-500">
          No repair cases available yet.
        </p>
      )}

      {/* ✅ PASS UPDATED DATA WITH THUMBNAIL */}
      <CasesClient cases={cases} />

    </main>
  );
}
