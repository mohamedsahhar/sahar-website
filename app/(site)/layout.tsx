import type { Metadata } from "next"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sa7arrepair.com"),

  title: {
    default: "Sa7ar Quick Care | Electronics Repair in Cairo",
    template: "%s | Sa7ar Quick Care",
  },

  alternates: {
    canonical: "/",
  },
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}