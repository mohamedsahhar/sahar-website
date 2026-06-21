import type { Metadata } from "next"
import Script from "next/script"
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
  const gaId = "G-00PS7JQZXM"

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>

      <Navbar />

      {children}

      <Footer />

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t shadow-lg">
        <div className="grid grid-cols-3 text-sm font-medium">
          <a
            href="https://wa.me/201021024094"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white text-center py-3"
          >
            WhatsApp
          </a>

          <a
            href="tel:+201021024094"
            className="bg-black text-white text-center py-3 border-l border-r border-gray-700"
          >
            Call
          </a>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=30.0041637,31.4213138"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white text-center py-3"
          >
            Map
          </a>
        </div>
      </div>
    </>
  )
}
