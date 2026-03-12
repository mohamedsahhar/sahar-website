import { prisma } from "@/lib/prisma"

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const repair = await prisma.repairCase.findUnique({
    where: {
      slug: slug,
    },
  })

  if (!repair) {
    return <div style={{ padding: "40px" }}>Repair not found.</div>
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        {repair.title}
      </h1>

      <p>
        <strong>Brand:</strong> {repair.brand}
      </p>

      <p>
        <strong>Device:</strong> {repair.device}
      </p>

      <h2 style={{ marginTop: "30px" }}>Problem</h2>
      <p>{repair.problem}</p>

      <h2 style={{ marginTop: "30px" }}>Repair Solution</h2>
      <p>{repair.solution}</p>

    </div>
  )
}