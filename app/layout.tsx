import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://sa7arrepair.com"),

  title: {
    default: "Sa7ar Quick Care | Electronics Repair in Egypt",
    template: "%s | Sa7ar Quick Care",
  },

  description:
    "Professional electronics repair service in Egypt. We repair smartphones, AirPods, speakers, Apple devices, robot vacuums, and more. Fast and reliable service.",

  keywords: [
    "phone repair Egypt",
    "AirPods repair",
    "JBL speaker repair",
    "electronics repair Cairo",
    "robot vacuum repair",
    "Apple device repair",
  ],

  authors: [{ name: "Sa7ar Quick Care" }],
  creator: "Sa7ar Quick Care",

  openGraph: {
    title: "Sa7ar Quick Care | Electronics Repair",
    description:
      "Professional repair service for phones, speakers, AirPods, and electronics in Egypt.",
    url: "https://sa7arrepair.com",
    siteName: "Sa7ar Quick Care",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // you can add this later
        width: 1200,
        height: 630,
        alt: "Sa7ar Quick Care",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
