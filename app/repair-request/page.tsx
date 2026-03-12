"use client"

import { useState } from "react"

export default function RepairRequest() {

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [device, setDevice] = useState("")
  const [model, setModel] = useState("")
  const [problem, setProblem] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const message = `
Repair Request - Sa7ar Quick Care

Name: ${name}
Phone: ${phone}
Device Type: ${device}
Brand / Model: ${model}
Problem: ${problem}
`

    const encodedMessage = encodeURIComponent(message)

    const whatsappURL = `https://wa.me/201021024094?text=${encodedMessage}`

    window.open(whatsappURL, "_blank")
  }

  return (
    <main className="min-h-screen p-10 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold text-center mb-8">
        Request a Repair
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        <input
          className="border p-3 rounded"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Device Type (Phone, Robot Vacuum, Speaker...)"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
        />

        <input
          className="border p-3 rounded"
          placeholder="Brand / Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <textarea
          className="border p-3 rounded"
          placeholder="Describe the problem"
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <button className="bg-black text-white p-3 rounded">
          Submit Repair Request
        </button>

      </form>

    </main>
  );
}