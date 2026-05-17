"use client"

import { useState } from "react"
import { TrackingResult, type TrackingResponse } from "./TrackingResult"

const API_URL = "https://system.sa7arrepair.com/api/public/track"
const genericError =
  "تعذر العثور على بيانات الصيانة. يرجى التأكد من رقم الصيانة ورقم الهاتف."

export default function TrackLookupPage() {
  const [repairNumber, setRepairNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TrackingResponse | null>(null)

  async function submitLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    try {
      setLoading(true)
      setError("")
      setResult(null)

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repairNumber,
          phone,
        }),
      })
      const data = (await response.json()) as TrackingResponse

      if (!response.ok || !data.success || !data.repair) {
        throw new Error(genericError)
      }

      setResult(data)
    } catch {
      setError(genericError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page} dir="rtl">
      <section style={card}>
        <div style={header}>
          <p style={eyebrow}>متابعة الصيانة</p>
          <h1 style={title}>تابع حالة جهازك</h1>
          <p style={subtitle}>
            أدخل رقم الصيانة ورقم الهاتف المسجل لمعرفة آخر حالة للصيانة.
          </p>
        </div>

        <form onSubmit={submitLookup} style={form}>
          <label style={field}>
            <span style={label}>رقم الصيانة</span>
            <input
              value={repairNumber}
              onChange={(event) => setRepairNumber(event.target.value)}
              placeholder="مثال: R-20260517-001"
              style={input}
            />
          </label>

          <label style={field}>
            <span style={label}>رقم الهاتف</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01XXXXXXXXX"
              inputMode="tel"
              style={input}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "جاري البحث..." : "متابعة حالة الصيانة"}
          </button>
        </form>

        {error && <div style={errorBox}>{error}</div>}

        {result?.repair && (
          <div style={resultArea}>
            <TrackingResult repair={result.repair} />
          </div>
        )}
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

const subtitle = {
  margin: "10px auto 0",
  maxWidth: "520px",
  color: "#64748b",
  lineHeight: 1.8,
}

const form = {
  display: "grid",
  gap: "14px",
}

const field = {
  display: "grid",
  gap: "7px",
}

const label = {
  color: "#334155",
  fontWeight: 800,
}

const input = {
  width: "100%",
  boxSizing: "border-box" as const,
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  padding: "13px 14px",
  fontSize: "16px",
  direction: "ltr" as const,
}

const button = {
  border: "none",
  borderRadius: "12px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 800,
  padding: "14px",
}

const errorBox = {
  marginTop: "16px",
  padding: "13px",
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: "12px",
  lineHeight: 1.7,
}

const resultArea = {
  marginTop: "20px",
}
