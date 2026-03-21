import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProblemPage({ params }: any) {

  const { problem } = await params;

  const repairs = await prisma.repairCase.findMany({
    where: {
      problemType: {
        equals: problem,
      },
    },
  });

  return (
    <div style={{ padding: "40px" }}>
      <h1>Repairs for: {problem}</h1>

      <div style={{ marginTop: "20px", display: "grid", gap: "15px" }}>
        {repairs.map((repair: any) => (
          <Link
            key={repair.slug}
            href={`/cases/${repair.slug}`}
            style={{
              padding: "14px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              textDecoration: "none",
              color: "black",
              background: "#fafafa"
            }}
          >
            <h3>{repair.title}</h3>
            <p>{repair.brand} {repair.device}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
