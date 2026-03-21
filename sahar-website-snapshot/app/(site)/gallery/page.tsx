import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export default async function GalleryPage() {

  const repairs = await prisma.repairCase.findMany({
    where: {
      beforeImage: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Repair Gallery
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        Real repair photos from Sa7ar Quick Care workshop.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >

        {repairs.map((repair: any) => (

          <Link
            key={repair.slug}
            href={`/cases/${repair.slug}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >

            {repair.beforeImage && (
              <Image
  src={repair.beforeImage}
  alt={`${repair.brand} ${repair.device} repair before fix - ${repair.problem}`}
  width={600}
  height={400}
  style={{
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  }}
/>

            )}

            <h3 style={{ marginTop: "10px", fontSize: "16px" }}>
              {repair.title}
              <p style={{ fontSize: "14px", color: "#666" }}>
  {repair.brand} • {repair.device}
</p>

            </h3>

          </Link>

        ))}

      </div>

    </div>
  )
}
