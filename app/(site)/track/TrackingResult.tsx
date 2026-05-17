"use client"

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

function formatDate(value?: string) {
  if (!value) return "-"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function TrackingResult({
  repair,
}: {
  repair: TrackingRepair
}) {
  const whatsappMessage = `السلام عليكم، أريد الاستفسار عن حالة الصيانة رقم ${repair.repairNumber || ""}`
  const whatsappUrl = `https://wa.me/201021024094?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <div style={resultWrap} dir="rtl">
      <div style={statusPanel}>
        <span style={statusLabel}>الحالة الحالية</span>
        <strong style={statusValue}>
          {repair.status || "جاري متابعة حالة الصيانة"}
        </strong>
      </div>

      <div style={infoGrid}>
        <Info label="رقم الصيانة" value={repair.repairNumber || "-"} />
        <Info label="الجهاز" value={repair.device || "-"} />
        <Info label="الماركة" value={repair.brand || "-"} />
        <Info label="تاريخ الاستلام" value={formatDate(repair.receivedAt || repair.createdAt)} />
        <Info label="العطل المسجل" value={repair.problem || "-"} wide />
      </div>

      <div style={timelineCard}>
        <h2 style={sectionTitle}>متابعة الحالة</h2>

        <div style={timelineList}>
          {(repair.timeline || []).map((step) => (
            <div key={step.label} style={timelineItem}>
              <span style={step.current ? activeMark : step.completed ? doneMark : emptyMark}>
                {step.current ? "●" : step.completed ? "✔" : "○"}
              </span>
              <span style={step.current ? activeStep : stepText}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={contactBox}>
        <div>
          <h2 style={sectionTitle}>هل تحتاج مساعدة؟</h2>
          <p style={contactText}>
            للاستفسارات يرجى التواصل معنا عبر واتساب
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={whatsappBtn}
        >
          واتساب
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
