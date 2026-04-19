import { Facebook, Instagram, Music2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import RelatedNews from "@/app/components/RelatedNews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ar: "/ar",
    },
  },
  title: "Phone Repair in New Cairo | iPhone, AirPods & Electronics Repair Egypt",
  description:
    "Sa7ar Quick Care is a professional repair center in New Cairo, Egypt. We fix iPhones, AirPods, JBL speakers, Apple devices, and advanced electronics with fast and reliable service.",
};

export default async function Home() {
  const latestCases = await prisma.repairCase.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      device: { include: { brand: true } },
    },
  });

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="text-center py-14 md:py-28 bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4">

        <div className="mb-5">
          <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-medium">
            Trusted Repair Center in New Cairo
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-5 text-gray-900 leading-tight max-w-5xl mx-auto">
          Professional Phone & Electronics Repair in Cairo, Egypt
        </h1>

        <p className="text-lg md:text-2xl text-gray-700 mb-5 font-medium">
          iPhone • AirPods • JBL • Speakers • Robot Vacuums
        </p>

        <p className="text-gray-600 max-w-3xl mx-auto mb-3 text-base md:text-lg">
          Fast diagnostics, honest service, and real repair expertise for advanced electronics.
        </p>

        <p className="text-gray-500 text-sm md:text-base">
          Located in New Cairo – Serving customers across Cairo & Egypt.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-600 mt-5">
          <Link href="/devices" className="underline hover:text-blue-800">
            Browse Devices
          </Link>

          <Link href="/repairs" className="underline hover:text-blue-800">
            Browse Brands
          </Link>

          <Link href="/cases" className="underline hover:text-blue-800">
            View Repair Cases
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

          <a
            href="https://wa.me/201021024094"
            target="_blank"
            className="inline-block bg-green-600 text-white px-7 py-4 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
          >
            Contact us on WhatsApp
          </a>

          <Link
            href="/repair-request"
            className="inline-block bg-black text-white px-7 py-4 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md"
          >
            Book Repair Appointment
          </Link>

        </div>

        <p className="mt-6 text-sm text-gray-500">
          Trusted by customers across Egypt for reliable repair service.
        </p>

        {/* Trust Strip */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">

          <span className="border px-3 py-1 rounded-full bg-white">
            Same Day Service Available
          </span>

          <span className="border px-3 py-1 rounded-full bg-white">
            Genuine Parts When Available
          </span>

          <span className="border px-3 py-1 rounded-full bg-white">
            Fast WhatsApp Response
          </span>

          <span className="border px-3 py-1 rounded-full bg-white">
            New Cairo Location
          </span>

        </div>

      </section>

      <div className="bg-white">
        <RelatedNews />
      </div>

      {/* CUSTOMER REVIEWS */}
      <section className="py-20 bg-gray-50 text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>

        <p className="text-gray-600 mt-3">
          Trusted by customers across Egypt for professional electronics repair
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-700">
              “Excellent service! My JBL speaker was repaired quickly and now works perfectly.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">
              Google Review
            </p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-700">
              “Very professional repair center. They fixed my robot vacuum battery issue.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">
              Customer Feedback
            </p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-700">
              “Fast and reliable service. Highly recommended for AirPods and electronics repair.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">
              Facebook Review
            </p>
          </div>

        </div>

      </section>

      {/* LATEST CASES */}
      <section className="py-20 bg-gray-50 text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Latest Repair Cases
        </h2>

        <p className="text-gray-600 mt-3">
          Real repair cases from our workshop in New Cairo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

          {latestCases.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >

              {c.images?.[0] && (
                <div className="relative w-full h-44 md:h-56">
                  <Image
                    src={c.images[0]}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-5">

                <h3 className="font-semibold text-lg text-gray-900">
                  {c.title}
                </h3>

                <p className="text-gray-600 mt-1">
                  {c.device?.brand?.name} {c.device?.name}
                </p>

                <Link
                  href={`/cases/${c.slug}`}
                  className="inline-block mt-3 text-blue-600 hover:underline"
                >
                  View Repair →
                </Link>

              </div>

            </div>
          ))}

        </div>

        <div className="mt-10">
          <Link
            href="/cases"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            View All Repair Cases
          </Link>
        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gray-100 text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Why Choose Sa7ar Quick Care
        </h2>

        <p className="text-gray-600 mt-3">
          Professional repair service trusted across Egypt
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto">

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">
              Professional Diagnostics
            </h3>
            <p className="text-gray-600 mt-2">
              Accurate troubleshooting before every repair.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">
              Specialized Electronics Repair
            </h3>
            <p className="text-gray-600 mt-2">
              From robot vacuums to DJ mixers and speakers.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">
              Nationwide Shipping
            </h3>
            <p className="text-gray-600 mt-2">
              Customers from all over Egypt can send devices.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">
              Trusted by Many Customers
            </h3>
            <p className="text-gray-600 mt-2">
              Excellent feedback from Google and Facebook.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}