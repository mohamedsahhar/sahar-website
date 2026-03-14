import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {

  const { slug } = await params

  const repair = await prisma.repairCase.findUnique({
    where: { slug },
  })

  if (!repair) {
    return {
      title: "Repair Case | Sa7ar Quick Care",
    }
  }

  return {
    title: `${repair.title} | Sa7ar Quick Care`,
    description: `Learn how we repaired ${repair.device} (${repair.brand}) at Sa7ar Quick Care service center.`,
  }
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const repair = await prisma.repairCase.findUnique({
    where: { slug },
  })

  if (!repair) {
    return <div style={{ padding: "40px" }}>Repair not found.</div>
  }

  const relatedRepairs = await prisma.repairCase.findMany({
    where: {
      OR: [
        { brand: repair.brand },
        { device: repair.device }
      ],
      NOT: {
        slug: repair.slug,
      },
    },
    take: 3,
  })

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: repair.title,
            description: repair.problem,
            author: {
              "@type": "Organization",
              name: "Sa7ar Quick Care",
            },
            publisher: {
              "@type": "Organization",
              name: "Sa7ar Quick Care",
            },
          }),
        }}
      />

      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        {repair.title}
      </h1>

      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
        <a href="/" style={{ textDecoration: "none", color: "#666" }}>Home</a>
        {" / "}
        <a href="/cases" style={{ textDecoration: "none", color: "#666" }}>Repair Cases</a>
        {" / "}
        {repair.device}
      </div>

      {/* Before Repair */}
      {repair.beforeImage && (
        <>
          <h2 style={{ marginTop: "30px" }}>Before Repair</h2>
          <Image
            src={repair.beforeImage}
            alt={`${repair.brand} ${repair.device} before repair`}
            width={900}
            height={500}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          />
        </>
      )}

      {/* Repair Process */}
      {repair.image && (
        <>
          <h2 style={{ marginTop: "30px" }}>Repair Process</h2>
          <Image
            src={repair.image}
            alt={`${repair.brand} ${repair.device} repair process`}
            width={900}
            height={500}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          />
        </>
      )}

      {/* After Repair */}
      {repair.afterImage && (
        <>
          <h2 style={{ marginTop: "30px" }}>After Repair</h2>
          <Image
            src={repair.afterImage}
            alt={`${repair.brand} ${repair.device} after repair`}
            width={900}
            height={500}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          />
        </>
      )}

      {/* Repair Video */}
      {repair.videoUrl && (
        <>
          <h2 style={{ marginTop: "30px" }}>Repair Video</h2>
          <iframe
            src={repair.videoUrl}
            width="100%"
            height="400"
            style={{ borderRadius: "12px", marginTop: "10px" }}
            allowFullScreen
          />
        </>
      )}

      {/* Repair Info Box */}
      <div
        style={{
          background: "#f7f7f7",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <p><strong>Brand:</strong> {repair.brand}</p>
        <p><strong>Device:</strong> {repair.device}</p>

        {repair.repairTime && (
          <p><strong>Repair Time:</strong> {repair.repairTime}</p>
        )}
      </div>

      <h2 style={{ marginTop: "30px" }}>Problem</h2>
      <p>{repair.problem}</p>

      <h2 style={{ marginTop: "30px" }}>Repair Solution</h2>
      <p>{repair.solution}</p>

      {/* Related Repairs */}
      {relatedRepairs.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <h2 style={{ marginBottom: "20px" }}>Related Repairs</h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {relatedRepairs.map((item) => (
              <a
                key={item.slug}
                href={`/cases/${item.slug}`}
                style={{
                  padding: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "black",
                  background: "#fafafa",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fafafa"
                }}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp CTA */}
      <div
        style={{
          marginTop: "50px",
          padding: "24px",
          background: "#f6f6f6",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>
          Need this repair?
        </h3>

        <p style={{ marginBottom: "16px", color: "#555" }}>
          Contact Sa7ar Quick Care on WhatsApp and we will help you.
        </p>

        <a
          href="https://wa.me/201021024094"
          target="_blank"
          style={{
            background: "#25D366",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Chat on WhatsApp
        </a>
      </div>

    </div>
  )
}