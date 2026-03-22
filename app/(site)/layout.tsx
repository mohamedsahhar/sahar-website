import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Sa7ar Quick Care",
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}