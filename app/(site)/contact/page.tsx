import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Script from "next/script"

// Force dynamic data
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Contact Sa7ar Quick Care | Electronics Repair Cairo",
  description:
    "Contact Sa7ar Quick Care in Cairo for phone repair, speaker repair, AirPods repair, Apple Pencil repair and electronics repair services.",
}

export default async function Contact() {
  const whatsappNumber = "201021024094"

  const business = await prisma.businessInfo.findFirst()

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you repair JBL speakers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Sa7ar Quick Care repairs JBL speakers and charging, battery, and board issues.",
        },
      },
      {
        "@type": "Question",
        name: "Where are you located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We are located in New Cairo, 5th Settlement, First District, Life Mall, Cairo, Egypt.",
        },
      },
      {
        "@type": "Question",
        name: "Can customers ship devices from outside Cairo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, customers across Egypt can ship devices using Aramex, Bosta, or Egypt Post.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact you quickly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The fastest way is via WhatsApp using the contact buttons on our website.",
        },
      },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* HERO */}
      <section className="text-center mb-10">

        <div className="mb-4">
          <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-medium">
            Trusted Repair Center in New Cairo
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Need Help With a Repair?
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
          Fast WhatsApp support, professional diagnostics, and reliable repair service for phones, speakers, AirPods, Apple devices, and advanced electronics.
        </p>

        <p className="text-sm text-gray-500">
          Serving customers across Cairo & Egypt
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">

          <Link
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hello, I need a repair service for my device."
            )}`}
            target="_blank"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            WhatsApp Now
          </Link>

          <a
            href="tel:+201021024094"
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Call Now
          </a>

          <Link
            href="/repair-request"
            className="border px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Book Repair
          </Link>

        </div>

      </section>

      {/* Existing Page Content Continues Here Exactly Same */}
      
      <div className="grid md:grid-cols-2 gap-10">

        <div className="space-y-8">

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Phone Numbers</h2>

            <div className="flex flex-col gap-2">
              <a href="tel:+201021024094" className="text-blue-600 hover:underline">+20 102 102 4094</a>
              <a href="tel:+201210005005" className="text-blue-600 hover:underline">+20 121 000 5005</a>
              <a href="tel:+201208590878" className="text-blue-600 hover:underline">+20 120 859 0878</a>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Workshop Location</h2>

            <p className="text-gray-700 mb-2">
              Cairo, Egypt, New Cairo, 5th Settlement, First District, Life Mall.
            </p>

            <p className="text-gray-700 mb-3">
              مصر - القاهرة - التجمع الخامس - الحي الأول - لايف مول
            </p>
          </div>

        </div>

        <div>
          <div className="border rounded-2xl overflow-hidden shadow-sm">

            <iframe
  src="https://www.google.com/maps?q=30.0041637,31.4213138&z=17&output=embed"
  width="100%"
  height="430"
  loading="lazy"
  title="Sa7ar Quick Care Map"
  style={{ border: 0 }}
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

          </div>
        </div>

      </div>

    </div>
  )
}