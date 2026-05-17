"use client"

export type TrackingLanguage = "ar" | "en"

export type TrackingRepair = {
  repairNumber?: string
  device?: string
  brand?: string
  problem?: string
  receivedAt?: string
  createdAt?: string
  status?: string
  timeline?: Array<{
    label: string
    current: boolean
    completed: boolean
  }>
  shopContact?: {
    whatsapp?: string
    phone?: string
    website?: string
  }
}

export type TrackingResponse = {
  success?: boolean
  repair?: TrackingRepair
  error?: string
}

const resultCopy = {
  ar: {
    dir: "rtl" as const,
    locale: "ar-EG",
    currentStatus: "الحالة الحالية",
    fallbackStatus: "جاري متابعة حالة الصيانة",
    repairNumber: "رقم الصيانة",
    device: "الجهاز",
    brand: "الماركة",
    receivedDate: "تاريخ الاستلام",
    problem: "العطل المسجل",
    timelineTitle: "متابعة الحالة",
    helpTitle: "هل تحتاج مساعدة؟",
    helpText: "للاستفسارات يرجى التواصل معنا عبر واتساب",
    whatsapp: "واتساب",
    whatsappMessage: (repairNumber: string) =>
      `السلام عليكم، أريد الاستفسار عن حالة الصيانة رقم ${repairNumber}`,
  },
  en: {
    dir: "ltr" as const,
    locale: "en-US",
    currentStatus: "Current status",
    fallbackStatus: "Repair status is being updated",
    repairNumber: "Repair number",
    device: "Device",
    brand: "Brand",
    receivedDate: "Received date",
    problem: "Reported problem",
    timelineTitle: "Status timeline",
    helpTitle: "Need help?",
    helpText: "For questions, please contact us on WhatsApp.",
    whatsapp: "WhatsApp",
    whatsappMessage: (repairNumber: string) =>
      `Hello, I would like to ask about repair status ${repairNumber}`,
  },
}

const englishStatusLabels: Record<string, string> = {
  "تم استلام الجهاز": "Device received",
  "جاري الفحص": "Inspection in progress",
  "في انتظار موافقة العميل": "Waiting for customer approval",
  "جاري الإصلاح": "Repair in progress",
  "جاري الاختبار النهائي": "Final testing in progress",
  "جاهز للاستلام": "Ready for pickup",
  "تم التسليم": "Delivered",
  "جاري متابعة حالة الصيانة": "Repair status is being updated",
}

function translateStatusLabel(label: string | undefined, language: TrackingLanguage) {
  if (!label) return resultCopy[language].fallbackStatus

  if (language === "ar") return label

  return englishStatusLabels[label] || label
}

function formatDate(value: string | undefined, language: TrackingLanguage) {
  if (!value) return "-"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleDateString(resultCopy[language].locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function TrackingResult({
  repair,
  language,
}: {
  repair: TrackingRepair
  language: TrackingLanguage
}) {
  const copy = resultCopy[language]
  const repairNumber = repair.repairNumber || ""
  const whatsappUrl = `https://wa.me/201021024094?text=${encodeURIComponent(
    copy.whatsappMessage(repairNumber)
  )}`

  return (
    <div style={resultWrap} dir={copy.dir}>
      <div style={statusPanel}>
        <span style={statusLabel}>{copy.currentStatus}</span>
        <strong style={statusValue}>
          {translateStatusLabel(repair.status, language)}
        </strong>
      </div>

      <div style={infoGrid}>
        <Info label={copy.repairNumber} value={repair.repairNumber || "-"} />
        <Info label={copy.device} value={repair.device || "-"} />
        <Info label={copy.brand} value={repair.brand || "-"} />
        <Info
          label={copy.receivedDate}
          value={formatDate(repair.receivedAt || repair.createdAt, language)}
        />
        <Info label={copy.problem} value={repair.problem || "-"} wide />
      </div>

      <div style={timelineCard}>
        <h2 style={sectionTitle}>{copy.timelineTitle}</h2>

        <div style={timelineList}>
          {(repair.timeline || []).map((step) => (
            <div key={step.label} style={timelineItem}>
              <span style={step.current ? activeMark : step.completed ? doneMark : emptyMark}>
                {step.current ? "●" : step.completed ? "✔" : "○"}
              </span>
              <span style={step.current ? activeStep : stepText}>
                {translateStatusLabel(step.label, language)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={contactBox}>
        <div>
          <h2 style={sectionTitle}>{copy.helpTitle}</h2>
          <p style={contactText}>{copy.helpText}</p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={whatsappBtn}
        >
          {copy.whatsapp}
        </a>
      </div>
    </div>
  )
}

function Info({
  label,
  value,
  wide,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div style={wide ? wideInfoCard : infoCard}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValue}>{value}</strong>
    </div>
  )
}

const resultWrap = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
}

const statusPanel = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
  flexWrap: "wrap" as const,
  padding: "18px",
  background: "#111827",
  color: "#fff",
  borderRadius: "14px",
}

const statusLabel = {
  color: "#cbd5e1",
  fontSize: "14px",
}

const statusValue = {
  fontSize: "22px",
}

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
}

const infoCard = {
  padding: "14px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
}

const wideInfoCard = {
  ...infoCard,
  gridColumn: "1 / -1",
}

const infoLabel = {
  display: "block",
  color: "#64748b",
  fontSize: "13px",
  marginBottom: "6px",
}

const infoValue = {
  color: "#111827",
  overflowWrap: "anywhere" as const,
}

const timelineCard = {
  padding: "16px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
}

const sectionTitle = {
  margin: "0 0 12px",
  fontSize: "18px",
}

const timelineList = {
  display: "grid",
  gap: "10px",
}

const timelineItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
}

const doneMark = {
  color: "#16a34a",
  fontWeight: 800,
}

const activeMark = {
  color: "#2563eb",
  fontWeight: 800,
}

const emptyMark = {
  color: "#94a3b8",
  fontWeight: 800,
}

const stepText = {
  color: "#475569",
}

const activeStep = {
  color: "#111827",
  fontWeight: 800,
}

const contactBox = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap" as const,
  padding: "16px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "14px",
}

const contactText = {
  margin: 0,
  color: "#166534",
}

const whatsappBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "0 18px",
  background: "#16a34a",
  color: "#fff",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 800,
}
