"use client"

import { useEffect, useState } from "react"
import { TrackingResult, type TrackingLanguage, type TrackingResponse } from "./TrackingResult"

const API_URL = "https://system.sa7arrepair.com/api/public/track"
const languageStorageKey = "sa7ar_language"

const pageCopy = {
  ar: {
    dir: "rtl" as const,
    eyebrow: "متابعة الصيانة",
    title: "تابع حالة جهازك",
    subtitle: "أدخل رقم الصيانة ورقم الهاتف المسجل لمعرفة آخر حالة للصيانة.",
    repairNumber: "رقم الصيانة",
    repairPlaceholder: "مثال: R-20260517-001",
    phone: "رقم الهاتف",
    phonePlaceholder: "01XXXXXXXXX",
    submit: "متابعة حالة الصيانة",
    loading: "جاري البحث...",
    error: "تعذر العثور على بيانات الصيانة. يرجى التأكد من رقم الصيانة ورقم الهاتف.",
  },
  en: {
    dir: "ltr" as const,
    eyebrow: "Repair Tracking",
    title: "Track your device repair",
    subtitle: "Enter your repair number and registered phone number to see the latest repair status.",
    repairNumber: "Repair number",
    repairPlaceholder: "Example: R-20260517-001",
    phone: "Phone number",
    phonePlaceholder: "01XXXXXXXXX",
    submit: "Track repair status",
    loading: "Searching...",
    error: "We could not find this repair. Please check the repair number and phone number.",
  },
}

function getRequestedLanguage(): TrackingLanguage {
  if (typeof window === "undefined") return "ar"

  const params = new URLSearchParams(window.location.search)
  const lang = params.get("lang")

  if (lang === "en" || lang === "ar") {
    window.localStorage.setItem(languageStorageKey, lang)
    return lang
  }

  const storedLang = window.localStorage.getItem(languageStorageKey)

  return storedLang === "en" || storedLang === "ar" ? storedLang : "ar"
}

export default function TrackLookupPage() {
  const [language, setLanguage] = useState<TrackingLanguage>("ar")
  const [repairNumber, setRepairNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TrackingResponse | null>(null)
  const copy = pageCopy[language]

  useEffect(() => {
    setLanguage(getRequestedLanguage())
  }, [])

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
        throw new Error(copy.error)
      }

      setResult(data)
    } catch {
      setError(copy.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page} dir={copy.dir}>
      <section style={card}>
        <div style={header}>
          <p style={eyebrow}>{copy.eyebrow}</p>
          <h1 style={title}>{copy.title}</h1>
          <p style={subtitle}>{copy.subtitle}</p>
        </div>

        <form onSubmit={submitLookup} style={form}>
          <label style={field}>
            <span style={label}>{copy.repairNumber}</span>
            <input
              value={repairNumber}
              onChange={(event) => setRepairNumber(event.target.value)}
              placeholder={copy.repairPlaceholder}
              style={input}
            />
          </label>

          <label style={field}>
            <span style={label}>{copy.phone}</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={copy.phonePlaceholder}
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
            {loading ? copy.loading : copy.submit}
          </button>
        </form>

        {error && <div style={errorBox}>{error}</div>}

        {result?.repair && (
          <div style={resultArea}>
            <TrackingResult repair={result.repair} language={language} />
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
