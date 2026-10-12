import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatText(text: string) {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// SEO
export async function generateMetadata({ params }: any) {

  const { brand, problem } = await params;
  const brandRecord = await prisma.brand.findUnique({ where: { slug: brand } });
  const problemName = formatText(problem);

  if (!brandRecord) {
    return {
      title: "Repair Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${brandRecord.name} ${problemName} Repair in New Cairo`,
    description: `Professional ${brandRecord.name} ${problemName} repair in New Cairo. Explore real repair cases handled by Sa7ar Quick Care.`,
    alternates: { canonical: `/repairs/${brand}/${problem}` },
  };
}

// PAGE
export default async function BrandProblemPage({ params }: any) {

  const { brand, problem } = await params;

  const brandRecord = await prisma.brand.findUnique({ where: { slug: brand } });

  if (!brandRecord) notFound();

  const problemWords: string[] = String(problem).split("-").filter(Boolean);

  const repairs = await prisma.repairCase.findMany({
    where: {
      device: {
        brandId: brandRecord.id,
      },
      OR: problemWords.flatMap((word) => [
        { title: { contains: word, mode: "insensitive" as const } },
        { problem: { contains: word, mode: "insensitive" as const } },
        { solution: { contains: word, mode: "insensitive" as const } },
      ]),
    },
    include: {
      device: {
        include: {
          brand: true,
        },
      },
    },
  });

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      
      <h1>
        {brandRecord.name} {formatText(problem)} Repair
      </h1>

      <p style={{ marginBottom: "30px", color: "#666" }}>
        Professional repair service in New Cairo, with real cases handled by Sa7ar Quick Care.
      </p>

      {repairs.length === 0 && (
        <p style={{ marginBottom: "30px", color: "#666" }}>
          No matching repair cases are published yet. Contact us to ask about this service.
        </p>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {repairs.map((repair: any) => (
          <Link
            key={repair.slug}
            href={`/cases/${repair.slug}`}
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              textDecoration: "none",
              color: "black",
              background: "#fafafa",
            }}
          >
            <h3>{repair.title}</h3>
            <p>
              {repair.device?.brand?.name} {repair.device?.name}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}
