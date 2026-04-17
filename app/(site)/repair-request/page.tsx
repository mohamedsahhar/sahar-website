"use client"

import { useState } from "react"

export default function RequestRepairPage() {

  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [device, setDevice] = useState<string>("")
  const [model, setModel] = useState<string>("")
  const [problem, setProblem] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [time, setTime] = useState<string>("")
  const [captcha, setCaptcha] = useState<string>("")

  const num1 = 3
  const num2 = 4
  const correctAnswer = num1 + num2

  const handleSubmit = () => {

    if (!firstName || !lastName) {
      alert("Please enter your first and last name.")
      return
    }

    if (!/^[0-9]{11}$/.test(phone)) {
      alert("Phone number must be exactly 11 digits.")
      return
    }

    if (!device) {
      alert("Please select your device type.")
      return
    }

    if (!problem) {
      alert("Please describe the problem.")
      return
    }

    if (parseInt(captcha) !== correctAnswer) {
      alert("Human verification failed.")
      return
    }

    const message =
`Repair Request

Name: ${firstName} ${lastName}
Phone: ${phone}

Device: ${device}
Model: ${model || "Not specified"}

Problem:
${problem}

Preferred Date: ${date || "Not specified"}
Preferred Time: ${time || "Not specified"}

Sent from Sa7arRepair website.`

    const whatsapp =
`https://wa.me/201021024094?text=${encodeURIComponent(message)}`

    window.open(whatsapp, "_blank")
  }

  return (

    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px"
      }}
    >

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Request Repair
      </h1>

      <p style={{ marginBottom: "30px", color: "#666" }}>
        Fill the form and send your repair request via WhatsApp.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        <input
          placeholder="First Name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Last Name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone Number (11 digits) *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <select
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          style={inputStyle}
        >

          <option value="">Select Device Type *</option>

          <option>Phone</option>
          <option>Speaker</option>
          <option>Headphones</option>
          <option>AirPods</option>
          <option>Apple Watch</option>
          <option>Tablet</option>
          <option>Apple Pencil</option>
          <option>Other</option>

        </select>

        <input
          placeholder="Device Model (Example: JBL PartyBox 310 / iPhone 14)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Describe the problem *"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          style={{
            ...inputStyle,
            minHeight: "120px"
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
        />

        <div>

          <label style={{ fontSize: "14px", color: "#444" }}>
            Human Check: What is {num1} + {num2}? *
          </label>

          <input
            placeholder="Your answer"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            style={{ ...inputStyle, marginTop: "6px" }}
          />

        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: "14px",
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Send Repair Request
        </button>

      </div>

    </div>
  )
}

const inputStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%"
}
