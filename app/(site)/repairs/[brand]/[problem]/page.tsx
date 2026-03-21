import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatText(text: string) {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
export async function generateMetadata({ params }: any) {

  const { brand, problem } = await params;

  const format = (text: string) =>
    text.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  const brandName = format(brand);
  const problemName = format(problem);

  return {
    title: `${brandName} ${problemName} Repair | Sa7ar Quick Care`,
    description: `Professional ${brandName} ${problemName} repair service. Real repair cases handled by Sa7ar Quick Care.`,
  };
}

export default async function BrandProblemPage({ params }: any) {

  const { brand, problem } = await params;

  const repairs = await prisma.repairCase.findMany({
    where: {
      brand: brand,

    },
  });

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      
      <h1>
        {formatText(brand)} {formatText(problem)} Repair
      </h1>

      <p style={{ marginBottom: "30px", color: "#666" }}>
        Real repair cases handled by Sa7ar Quick Care.
      </p>

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
            <p>{repair.device}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}
