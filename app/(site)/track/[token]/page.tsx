"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { TrackingResult, type TrackingResponse } from "../TrackingResult"

const API_BASE = "https://system.sa7arrepair.com/api/public/track"
const genericError =
  "تعذر العثور على بيانات الصيانة. يرجى التأكد من رقم الصيانة ورقم الهاتف."

export default function TokenTrackingPage() {
  const params = useParams()
  const token = String(params?.token || "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [repair, setRepair] =
    useState<TrackingResponse["repair"]>(undefined)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError(genericError)
      return
    }

    loadTracking()
  }, [token])

  async function loadTracking() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_BASE}/${encodeURIComponent(token)}`,
        {
          cache: "no-store",
        }
      )
      const data = (await response.json()) as TrackingResponse

      if (!response.ok || !data.success || !data.repair) {
        throw new Error(genericError)
      }

      setRepair(data.repair)
    } catch {
      setError(genericError)
      setRepair(undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page} dir="rtl">
      <section style={card}>
        <div style={header}>
          <p style={eyebrow}>متابعة الصيانة</p>
          <h1 style={title}>حالة الصيانة</h1>
        </div>

        {loading && <div style={loadingBox}>جاري تحميل حالة الصيانة...</div>}

        {!loading && error && <div style={errorBox}>{error}</div>}

        {!loading && repair && <TrackingResult repair={repair} />}
      </section>
    </div>
  )
}

const page = {
  minHeight: "calc(100vh - 120px)",
  display: "flex",
  justifyContent: "center",
  padding: "42px 16px 80px",
  background: "#f8fafc",
}

const card = {
  width: "100%",
  maxWidth: "760px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
}

const header = {
  textAlign: "center" as const,
  marginBottom: "22px",
}

const eyebrow = {
  margin: "0 0 8px",
  color: "#2563eb",
  fontWeight: 800,
}

const title = {
  margin: 0,
  color: "#111827",
  fontSize: "34px",
}

const loadingBox = {
  padding: "16px",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: "12px",
  textAlign: "center" as const,
}

const errorBox = {
  padding: "16px",
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: "12px",
  lineHeight: 1.7,
}
