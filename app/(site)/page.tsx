import { Facebook, Instagram, Music2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
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
  title: "Electronics Repair in New Cairo",
  description:
    "Phone, AirPods, speaker, smartwatch, appliance and electronics repair in New Cairo. Professional diagnostics and repair at Sa7ar Quick Care.",
};

export default async function Home() {
  const [latestCases, repairBrands, businessInfo] = await Promise.all([
    prisma.repairCase.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        device: { include: { brand: true } },
      },
    }),
    prisma.brand.findMany({
      where: {
        devices: {
          some: {
            repairs: { some: {} },
          },
        },
      },
      include: {
        devices: {
          select: {
            _count: { select: { repairs: true } },
          },
        },
      },
    }),
    prisma.businessInfo.findFirst(),
  ]);

  const popularBrands = repairBrands
    .map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      repairCount: brand.devices.reduce(
        (total, device) => total + device._count.repairs,
        0
      ),
    }))
    .sort((a, b) => b.repairCount - a.repairCount || a.name.localeCompare(b.name))
    .slice(0, 10);

  const repairServices = [
    { label: "Mobile Phone Repair", href: "/cases?q=phone" },
    { label: "iPhone & Apple Repair", href: "/repairs/apple" },
    { label: "AirPods & Earbuds Repair", href: "/cases?q=airpods" },
    { label: "Headphone Repair", href: "/cases?q=headphone" },
    { label: "Speaker Repair", href: "/cases?q=speaker" },
    { label: "Smartwatch Repair", href: "/cases?q=smartwatch" },
    { label: "Coffee Machine Repair", href: "/cases?q=coffee+machine" },
    { label: "Home Appliance Repair", href: "/cases?q=appliance" },
    { label: "Robot Vacuum Repair", href: "/cases?q=robot+vacuum" },
    { label: "Scooter Repair", href: "/cases?q=scooter" },
    { label: "DJ & Audio Equipment", href: "/cases?q=DJ" },
  ];

  const workingHours = businessInfo?.workingHours || "10:00 AM - 10:00 PM";
  const daysOff = businessInfo?.daysOff || "Friday";
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sa7ar Quick Care",
    url: "https://www.sa7arrepair.com",
    logo: "https://www.sa7arrepair.com/sahar-transparent-black.png",
    telephone: "+201021024094",
    description:
      "Professional phone, audio, appliance, and electronics repair center in New Cairo, Egypt.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Life Mall, First District, Fifth Settlement",
      addressLocality: "New Cairo",
      addressRegion: "Cairo",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.0041637,
      longitude: 31.4213138,
    },
    hasMap:
      "https://www.google.com/maps/dir/?api=1&destination=30.0041637,31.4213138",
    sameAs: [
      "https://www.facebook.com/sa7ar.quick.care/",
      "https://www.instagram.com/sa7ar_quick_care/",
      "https://www.tiktok.com/@sa7arquickcare",
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* HERO */}
      <section className="text-center py-20 md:py-28 bg-gradient-to-b from-white to-gray-100 px-4">

        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
          Phone & Electronics Repair in Cairo, Egypt
        </h1>

        <p className="text-base md:text-xl text-gray-700 mb-6">
          Phones • Speakers • Robot Vacuums • DJ Mixers • AirPods
        </p>

        <p className="text-gray-600 max-w-2xl mx-auto mb-3">
          Sa7ar Quick Care is a professional electronics repair center in New Cairo, Egypt specializing in phone repair, iPhone repair, AirPods repair, JBL speaker repair, and advanced electronics maintenance.
        </p>

        <p className="text-gray-500 text-sm">
          Located in New Cairo – Serving all areas of Cairo and Egypt.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-600 mt-4">
          <Link href="/devices" className="underline hover:text-blue-800">Browse Devices</Link>
          <Link href="/repairs" className="underline hover:text-blue-800">Browse Brands</Link>
          <Link href="/cases" className="underline hover:text-blue-800">View Repair Cases</Link>
        </div>

        <div className="mt-6">
          <a
            href="https://wa.me/201021024094"
            target="_blank"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Contact us on WhatsApp
          </a>
        </div>

      </section>

      {/* POPULAR REPAIR SERVICES */}
      <section className="bg-white px-4 py-14 md:px-10 md:py-20" aria-labelledby="popular-repair-services">
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="popular-repair-services" className="text-2xl font-bold text-gray-900 md:text-3xl">
            Popular Repair Services
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-gray-600">
            Find repair help for phones, wearables, audio equipment, appliances,
            and other electronics. Select a service to see related work from our workshop.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {repairServices.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="flex min-h-16 items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left font-semibold text-gray-900 transition hover:border-orange-400 hover:shadow-md"
              >
                <span>{service.label}</span>
                <span className="text-orange-500" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-600">
            تفضل تصفح الموقع بالعربية؟{" "}
            <Link href="/ar" className="font-semibold text-blue-600 hover:underline">
              خدمات الصيانة باللغة العربية
            </Link>
          </p>
        </div>
      </section>

      {/* DYNAMIC POPULAR BRANDS */}
      {popularBrands.length > 0 && (
        <section className="bg-gray-50 px-4 py-14 md:px-10 md:py-20" aria-labelledby="popular-repair-brands">
          <div className="mx-auto max-w-6xl text-center">
            <h2 id="popular-repair-brands" className="text-2xl font-bold text-gray-900 md:text-3xl">
              Popular Brands We Repair
            </h2>
            <p className="mt-3 text-gray-600">
              Updated automatically from repair cases completed in our workshop.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {popularBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/repairs/${brand.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 font-semibold text-gray-900 transition hover:border-orange-400 hover:shadow-md"
                >
                  {brand.name} Repair
                </Link>
              ))}
            </div>

            <Link href="/repairs" className="mt-7 inline-block font-semibold text-blue-600 hover:underline">
              View all repair brands →
            </Link>
          </div>
        </section>
      )}

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
            <p className="mt-4 font-semibold text-gray-900">Google Review</p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-700">
              “Very professional repair center. They fixed my robot vacuum battery issue.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">Customer Feedback</p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-700">
              “Fast and reliable service. Highly recommended for AirPods and electronics repair.”
            </p>
            <p className="mt-4 font-semibold text-gray-900">Facebook Review</p>
          </div>

        </div>

      </section>


      {/* LATEST CASES (KEEP) */}
      <section className="py-20 bg-gray-50 text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Latest Repair Cases
        </h2>

        <p className="text-gray-600 mt-3">
          Real repair cases from our workshop in New Cairo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

          {latestCases.map((c) => (
            <div key={c.id} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">

              {c.images?.[0] && (
  <img src={c.images[0]} alt={c.title} className="w-full h-56 object-cover"/>
)}

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900">{c.title}</h3>

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
          <Link href="/cases" className="border px-6 py-3 rounded-lg hover:bg-gray-100">
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
            <h3 className="font-semibold text-lg text-gray-900">Professional Diagnostics</h3>
            <p className="text-gray-600 mt-2">Accurate troubleshooting before every repair.</p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">Specialized Electronics Repair</h3>
            <p className="text-gray-600 mt-2">From robot vacuums to DJ mixers and speakers.</p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">Nationwide Shipping</h3>
            <p className="text-gray-600 mt-2">Customers from all over Egypt can send devices.</p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg text-gray-900">Trusted by Many Customers</h3>
            <p className="text-gray-600 mt-2">Excellent feedback from Google and Facebook.</p>
          </div>

        </div>

      </section>

      {/* LOCAL INFORMATION */}
      <section className="bg-white px-4 py-14 md:px-10 md:py-20" aria-labelledby="visit-repair-center">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm md:p-10">
          <h2 id="visit-repair-center" className="text-2xl font-bold text-gray-900 md:text-3xl">
            Visit Our Repair Center in New Cairo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            First District, Life Mall, Fifth Settlement, New Cairo, Egypt.
            Customers outside Cairo can contact us about nationwide shipping.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <h3 className="font-semibold text-gray-900">Working Hours</h3>
              <p className="mt-1 text-sm text-gray-600">{workingHours}</p>
              <p className="mt-1 text-xs text-gray-500">Day off: {daysOff}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h3 className="font-semibold text-gray-900">Call or WhatsApp</h3>
              <a href="tel:+201021024094" className="mt-1 block text-sm text-blue-600 hover:underline">
                +20 102 102 4094
              </a>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h3 className="font-semibold text-gray-900">Directions</h3>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=30.0041637,31.4213138"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-blue-600 hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          {businessInfo?.notice && (
            <p className="mt-5 text-sm font-medium text-orange-700">{businessInfo.notice}</p>
          )}
        </div>
      </section>

    </main>
  );
}
