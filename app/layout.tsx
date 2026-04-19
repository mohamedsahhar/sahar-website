import "./globals.css"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sa7arrepair.com"),

  alternates: {
    canonical: "/",
  },

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
        url: "/og-image.jpg",
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
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sa7ar Quick Care",
    image: "https://www.sa7arrepair.com/og-image.jpg",
    url: "https://www.sa7arrepair.com",
    telephone: "+201021024094",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Life Mall, First District, 5th Settlement",
      addressLocality: "New Cairo",
      addressRegion: "Cairo",
      addressCountry: "EG",
    },
    areaServed: "Egypt",
    priceRange: "$$",
    sameAs: [
      "https://www.facebook.com/sa7ar.quick.care/",
      "https://www.instagram.com/sa7ar_quick_care/",
      "https://www.tiktok.com/@sa7arquickcare",
    ],
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">

        {children}

        {/* SEO Schema */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-00PS7JQZXM"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-00PS7JQZXM');
          `}
        </Script>

      </body>
    </html>
  )
}