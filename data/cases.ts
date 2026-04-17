export type RepairCase = {
  slug: string
  title: string
  brand: string
  device: string
  problem: string
  repairTime: string
  image: string

  beforeImage: string
  afterImage: string
  difficulty: string
  tools: string[]
  repairSteps: string[]
}

export const cases: RepairCase[] = [
  {
    slug: "jbl-partybox-310-charging-port-repair",
    title: "JBL PartyBox 310 Charging Port Repair",
    brand: "JBL",
    device: "JBL PartyBox 310",
    problem: "Charging Port Not Working",
    repairTime: "2 Hours",
    image: "/repairs/jbl-partybox-310.jpg",

    beforeImage: "/repairs/jbl-partybox-310-before.jpg",
    afterImage: "/repairs/jbl-partybox-310-after.jpg",
    difficulty: "Medium",

    tools: [
      "Screwdriver Set",
      "Soldering Station",
      "Plastic Pry Tools"
    ],

    repairSteps: [
      "Open the speaker housing carefully.",
      "Disconnect the internal battery.",
      "Remove the damaged charging port.",
      "Install the new charging port and solder connections.",
      "Reassemble the speaker and test charging."
    ]
  },
]