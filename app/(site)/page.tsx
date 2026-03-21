import { Facebook, Instagram, Music2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {

  const latestCases = await prisma.repairCase.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      device: {
        include: {
          brand: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="text-center py-20 md:py-28 bg-gradient-to-b from-white to-gray-100 px-4">

        {/* ✅ UPDATED H1 (SEO) */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
          Phone & Electronics Repair in Cairo, Egypt
        </h1>

        <p className="text-base md:text-xl text-gray-600 mb-6">
          Phones • Speakers • Robot Vacuums • DJ Mixers • AirPods
        </p>

        {/* ✅ IMPROVED SEO PARAGRAPH */}
        <p className="text-gray-500 max-w-2xl mx-auto mb-6">
          Sa7ar Quick Care is a professional repair center in Cairo specializing in phone repair,
          AirPods repair, speaker repair, Apple devices, and electronics maintenance.
          We provide fast, reliable, and affordable repair services across Egypt.
        </p>

        {/* ✅ NEW INTERNAL LINKS (SEO BOOST) */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-600">

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

      </section>


      {/* CUSTOMER REVIEWS */}
      <section className="py-20 bg-gray-50 text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>

        <p className="text-gray-500 mt-3">
          Trusted by customers across Egypt for professional electronics repair
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
              “Excellent service! My JBL speaker was repaired quickly and now works perfectly.”
            </p>
            <p className="mt-4 font-semibold">Google Review</p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
              “Very professional repair center. They fixed my robot vacuum cleaner battery issue.”
            </p>
            <p className="mt-4 font-semibold">Customer Feedback</p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
              “Fast and reliable service. Highly recommended for AirPods and electronics repair.”
            </p>
            <p className="mt-4 font-semibold">Facebook Review</p>
          </div>

        </div>

      </section>


      {/* REPAIR GALLERY */}
      <section className="py-20 bg-white text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Recent Repairs
        </h2>

        <p className="text-gray-500 mt-3">
          A glimpse of some devices we repaired at Sa7ar Quick Care
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">

          <div className="border rounded-xl overflow-hidden">
            <img src="/repair1.jpg" alt="Robot Vacuum Repair" className="w-full h-56 object-cover"/>
            <div className="p-4">
              <p className="font-semibold">Robot Vacuum Repair</p>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <img src="/repair2.jpg" alt="AirPods Repair" className="w-full h-56 object-cover"/>
            <div className="p-4">
              <p className="font-semibold">AirPods Battery Replacement</p>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <img src="/repair3.jpg" alt="Speaker Repair" className="w-full h-56 object-cover"/>
            <div className="p-4">
              <p className="font-semibold">Bluetooth Speaker Repair</p>
            </div>
          </div>

        </div>

      </section>


      {/* LATEST REPAIR CASES */}
      <section className="py-20 bg-gray-50 text-center px-4 md:px-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Latest Repair Cases
        </h2>

        <p className="text-gray-500 mt-3">
          Real repair cases from our workshop
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">

          {latestCases.map((c) => (
            <div key={c.id} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">

              {c.image && (
                <img src={c.image} alt={c.title} className="w-full h-56 object-cover"/>
              )}

              <div className="p-5">
                <h3 className="font-semibold text-lg">{c.title}</h3>

                <p className="text-gray-500 mt-1">
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

        <p className="text-gray-500 mt-3">
          Professional service trusted by customers across Egypt
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto">

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">Professional Diagnostics</h3>
            <p className="text-gray-500 mt-2">Accurate troubleshooting before every repair.</p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">Specialized Electronics Repair</h3>
            <p className="text-gray-500 mt-2">From robot vacuums to DJ mixers and speakers.</p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">Nationwide Shipping</h3>
            <p className="text-gray-500 mt-2">Customers from all over Egypt can send devices for repair.</p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">Trusted by Many Customers</h3>
            <p className="text-gray-500 mt-2">Excellent feedback from Google and Facebook reviews.</p>
          </div>

        </div>

      </section>


      {/* POPULAR REPAIRS */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">

        <h2 className="text-2xl font-semibold mb-8 text-center">
          Popular Repairs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="border rounded-xl p-6 hover:shadow transition">
            <h3 className="font-semibold mb-2">JBL Speaker Charging Port Repair</h3>
            <p className="text-gray-600 text-sm">Fix charging problems for JBL PartyBox, Flip, and other speakers.</p>
          </div>

          <div className="border rounded-xl p-6 hover:shadow transition">
            <h3 className="font-semibold mb-2">AirPods Battery Replacement</h3>
            <p className="text-gray-600 text-sm">Replace weak AirPods batteries and restore listening time.</p>
          </div>

          <div className="border rounded-xl p-6 hover:shadow transition">
            <h3 className="font-semibold mb-2">iPhone Charging Port Repair</h3>
            <p className="text-gray-600 text-sm">Fix iPhone charging issues caused by damaged charging ports.</p>
          </div>

          <div className="border rounded-xl p-6 hover:shadow transition">
            <h3 className="font-semibold mb-2">Apple Pencil Not Charging</h3>
            <p className="text-gray-600 text-sm">Repair Apple Pencil charging and connection problems.</p>
          </div>

        </div>

      </section>

    </main>
  );
}