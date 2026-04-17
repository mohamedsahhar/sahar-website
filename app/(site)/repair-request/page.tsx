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

    const message = `Hello Sa7ar Quick Care,

I would like to book a repair appointment.

Name: ${firstName} ${lastName}
Phone: ${phone}

Device Type: ${device}
Model: ${model || "Not specified"}

Problem:
${problem}

Preferred Date: ${date || "Not specified"}
Preferred Time: ${time || "Not specified"}

Please confirm availability.`

    const whatsapp = `https://wa.me/201021024094?text=${encodeURIComponent(message)}`
    window.open(whatsapp, "_blank")
  }

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "0 auto",
        padding: "40px 20px"
      }}
    >
      <h1
        style={{
          fontSize: "34px",
          marginBottom: "14px",
          fontWeight: "700"
        }}
      >
        Book Your Repair Appointment
      </h1>

      <p
        style={{
          marginBottom: "30px",
          color: "#666",
          lineHeight: "1.6"
        }}
      >
        Fast diagnostics and professional repair service.
        Fill the form below and send your request instantly on WhatsApp.
      </p>

      <div
        style={{
          background: "#f8f8f8",
          border: "1px solid #eee",
          padding: "16px",
          borderRadius: "10px",
          marginBottom: "25px",
          fontSize: "14px",
          lineHeight: "1.8"
        }}
      >
        ✅ Fast Response <br />
        ✅ Experienced Technicians <br />
        ✅ Genuine Parts When Available <br />
        ✅ New Cairo Location
      </div>

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
            minHeight: "120px",
            resize: "vertical"
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
          <label
            style={{
              fontSize: "14px",
              color: "#444"
            }}
          >
            Human Check: What is {num1} + {num2}? *
          </label>

          <input
            placeholder="Your answer"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            style={{
              ...inputStyle,
              marginTop: "6px"
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: "15px",
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Book on WhatsApp
        </button>

        <p
          style={{
            fontSize: "13px",
            color: "#777",
            textAlign: "center",
            marginTop: "4px"
          }}
        >
          No obligation consultation. We’ll review your request and reply quickly.
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%",
  background: "white"
}