"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { TrackingResult, type TrackingLanguage, type TrackingResponse } from "../TrackingResult"

const API_BASE = "https://system.sa7arrepair.com/api/public/track"
const languageStorageKey = "sa7ar_language"

const pageCopy = {
  ar: {
    dir: "rtl" as const,
    eyebrow: "متابعة الصيانة",
    title: "حالة الصيانة",
    loading: "جاري تحميل حالة الصيانة...",
    error: "تعذر العثور على بيانات الصيانة. يرجى التأكد من رقم الصيانة ورقم الهاتف.",
  },
  en: {
    dir: "ltr" as const,
    eyebrow: "Repair Tracking",
    title: "Repair Status",
    loading: "Loading repair status...",
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

export default function TokenTrackingPage() {
  const params = useParams()
  const token = String(params?.token || "")
  const [language, setLanguage] = useState<TrackingLanguage>("ar")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [repair, setRepair] =
    useState<TrackingResponse["repair"]>(undefined)
  const copy = pageCopy[language]

  useEffect(() => {
    setLanguage(getRequestedLanguage())
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError(copy.error)
      return
    }

    loadTracking()
  }, [token, language])

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
        throw new Error(copy.error)
      }

      setRepair(data.repair)
    } catch {
      setError(copy.error)
      setRepair(undefined)
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
        </div>

        {loading && <div style={loadingBox}>{copy.loading}</div>}

        {!loading && error && <div style={errorBox}>{error}</div>}

        {!loading && repair && (
          <TrackingResult repair={repair} language={language} />
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
