"use client"

export default function TestPage() {

  async function createRepair() {

    await fetch("/api/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "JBL PartyBox 310 Charging Port Repair",
        brand: "JBL",
        device: "PartyBox 310",
        problem: "Charging port damaged due to cable stress",
        solution: "Replaced charging port module and resoldered connections",

        image: "/repairs/jbl-partybox-310.jpg",
        beforeImage: "/repairs/jbl-partybox-310-before.jpg",
        afterImage: "/repairs/jbl-partybox-310-after.jpg",

        repairTime: "45 minutes"
      }),
    });

    alert("Repair created!");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Test Repair</h1>
      <button onClick={createRepair}>
        Create Repair
      </button>
    </div>
  )
}