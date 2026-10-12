import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Request an Electronics Repair in New Cairo",
  description:
    "Request phone, AirPods, speaker, appliance, or electronics repair from Sa7ar Quick Care in New Cairo.",
  alternates: { canonical: "/repair-request" },
}

export default function RepairRequestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
