import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatProblem(problem: string) {
  return problem
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function ProblemsPage() {

  const repairs = await prisma.repairCase.findMany();

  const problems = [
    ...new Set(
      repairs
        .map((r: any) => r.problemType)
        .filter(Boolean)
    ),
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      
      <h1 style={{ marginBottom: "20px" }}>
        Common Repair Problems
      </h1>

      <p style={{ marginBottom: "30px", color: "#666" }}>
        Explore common device problems we repair at Sa7ar Quick Care.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {problems.map((problem: any) => (
          <Link
            key={problem}
            href={`/problems/${problem}`}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              textDecoration: "none",
              color: "black",
              background: "#fafafa",
              transition: "all 0.2s",
              fontWeight: "500",
            }}
          >
            {formatProblem(problem)}
          </Link>
        ))}
      </div>

    </div>
  );
}
