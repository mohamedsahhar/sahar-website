"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function CasesPage() {

  const [search, setSearch] = useState("")
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/cases")
      .then(res => res.json())
      .then(data => setCases(data))
  }, [])

  const filteredCases = cases.filter((repair) =>
    repair.title.toLowerCase().includes(search.toLowerCase()) ||
    repair.device.toLowerCase().includes(search.toLowerCase()) ||
    repair.problem.toLowerCase().includes(search.toLowerCase()) ||
    repair.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px"
      }}
    >

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Repair Cases
      </h1>

      <input
        type="text"
        placeholder="Search repairs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "12px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "30px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "16px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >

        {filteredCases.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#777" }}>
            No repair cases found.
          </p>
        )}

        {filteredCases.map((repair) => (

          <Link
            key={repair.slug}
            href={`/cases/${repair.slug}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#fff",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"
            }}
          >

            {repair.image && (
              <Image
                src={repair.image}
                alt={`${repair.brand} ${repair.device} repair - ${repair.problem}`}
                width={400}
                height={250}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ padding: "16px" }}>

              <h2 style={{ fontSize: "18px", marginBottom: "8px", lineHeight: "1.4" }}>
                {repair.title}
              </h2>

              <p style={{ fontSize: "14px", color: "#666" }}>
                {repair.brand} • {repair.device}
              </p>

              <p style={{ fontSize: "14px", marginTop: "6px" }}>
                {repair.problem}
              </p>

              {repair.repairTime && (
                <p style={{ fontSize: "13px", marginTop: "8px", color: "green" }}>
                  Repair Time: {repair.repairTime}
                </p>
              )}

              <p style={{ marginTop: "12px", color: "blue", fontSize: "14px" }}>
                View Repair →
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>
  )
}