import { Facebook, Instagram, Music2, MessageCircle } from "lucide-react";
import { cases } from "../../data/cases";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="text-center py-28 bg-gradient-to-b from-white to-gray-100">

        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Professional Electronics Repair
        </h1>

        <p className="text-xl text-gray-600 mb-6">
          Phones • Speakers • Robot Vacuums • DJ Mixers • AirPods
        </p>

        <p className="text-gray-500 max-w-2xl mx-auto mb-10">
          Welcome to Sa7ar Quick Care. We specialize in repairing modern electronics
          including smartphones, headphones, speakers, DJ mixers and robot vacuum cleaners.
          Fast diagnosis, professional repair, and trusted service.
        </p>

        <div className="flex justify-center">
          <a
            href="#services"
            className="border border-gray-400 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            View Services
          </a>
        </div>

      </section>


      {/* SERVICES SECTION */}
      <section id="services" className="py-20 text-center bg-white">

        <h2 className="text-3xl font-bold text-gray-900">
          Our Repair Services
        </h2>

        <p className="text-gray-500 mt-3">
          Professional repair for modern electronics and smart devices
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-10">

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-xl">
              Robot Vacuum Repair
            </h3>
            <p className="text-gray-500 mt-2">
              Xiaomi, Roborock, Ecovacs, Dreame and more
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-xl">
              Speaker Repair
            </h3>
            <p className="text-gray-500 mt-2">
              JBL, Bose, Harman Kardon and Bluetooth speakers
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-xl">
              Phone Repair
            </h3>
            <p className="text-gray-500 mt-2">
              Screen replacement, battery and charging repairs
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-xl">
              AirPods & Earbuds Repair
            </h3>
            <p className="text-gray-500 mt-2">
              Battery replacement, charging issues and sound problems
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-xl">
              DJ Mixer Repair
            </h3>
            <p className="text-gray-500 mt-2">
              Crossfaders, buttons, headphone jacks and USB ports
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-xl">
              Headphone Cushion Replacement
            </h3>
            <p className="text-gray-500 mt-2">
              Large selection of ear pads in many colors and models
            </p>
          </div>

        </div>

      </section>


      {/* CUSTOMER REVIEWS */}
      <section id="reviews" className="py-20 bg-gray-50 text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>

        <p className="text-gray-500 mt-3">
          Trusted by customers across Egypt for professional electronics repair
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12 px-10 max-w-6xl mx-auto">

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
              “Excellent service! My JBL speaker was repaired quickly and now works perfectly.”
            </p>
            <p className="mt-4 font-semibold">
              Google Review
            </p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
              “Very professional repair center. They fixed my robot vacuum cleaner battery issue.”
            </p>
            <p className="mt-4 font-semibold">
              Customer Feedback
            </p>
          </div>

          <div className="border p-6 rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
              “Fast and reliable service. Highly recommended for AirPods and electronics repair.”
            </p>
            <p className="mt-4 font-semibold">
              Facebook Review
            </p>
          </div>

        </div>

      </section>


      {/* REPAIR GALLERY */}
      <section className="py-20 bg-white text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          Recent Repairs
        </h2>

        <p className="text-gray-500 mt-3">
          A glimpse of some devices we repaired at Sa7ar Quick Care
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12 px-10 max-w-6xl mx-auto">

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
<section className="py-20 bg-gray-50 text-center">

  <h2 className="text-3xl font-bold text-gray-900">
    Latest Repair Cases
  </h2>

  <p className="text-gray-500 mt-3">
    Real repair cases from our workshop
  </p>

  <div className="grid md:grid-cols-3 gap-8 mt-12 px-10 max-w-6xl mx-auto">

    {cases.slice(0,3).map((c)=>(
      <div key={c.slug} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">

        {c.image && (
          <img
            src={c.image}
            alt={c.title}
            className="w-full h-56 object-cover"
          />
        )}

        <div className="p-5">

          <h3 className="font-semibold text-lg">
            {c.title}
          </h3>

          <p className="text-gray-500 mt-1">
            {c.brand} {c.device}
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
      <section className="py-20 bg-gray-100 text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          Why Choose Sa7ar Quick Care
        </h2>

        <p className="text-gray-500 mt-3">
          Professional service trusted by customers across Egypt
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 px-10 max-w-6xl mx-auto">

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">
              Professional Diagnostics
            </h3>
            <p className="text-gray-500 mt-2">
              Accurate troubleshooting before every repair.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">
              Specialized Electronics Repair
            </h3>
            <p className="text-gray-500 mt-2">
              From robot vacuums to DJ mixers and speakers.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">
              Nationwide Shipping
            </h3>
            <p className="text-gray-500 mt-2">
              Customers from all over Egypt can send devices for repair.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl">
            <h3 className="font-semibold text-lg">
              Trusted by Many Customers
            </h3>
            <p className="text-gray-500 mt-2">
              Excellent feedback from Google and Facebook reviews.
            </p>
          </div>

        </div>

      </section>


      {/* BRANDS WE REPAIR */}
      <section className="py-20 bg-white text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          Brands We Repair
        </h2>

        <p className="text-gray-500 mt-3">
          Trusted experience with leading electronics brands
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-12 px-10 max-w-6xl mx-auto text-gray-700 font-semibold">

          <div>Apple</div>
          <div>JBL</div>
          <div>Harman Kardon</div>
          <div>Sony</div>
          <div>Xiaomi</div>
          <div>Roborock</div>
          <div>Dreame</div>
          <div>Bose</div>
          <div>Dyson</div>
          <div>Ecovacs</div>
          <div>Beats</div>
          <div>Anker</div>

        </div>

      </section>


      {/* NATIONWIDE SERVICE */}
      <section className="py-16 bg-gray-100 text-center">

        <h2 className="text-3xl font-bold">
          Nationwide Repair Service
        </h2>

        <p className="mt-4 text-gray-600">
          Customers from all over Egypt can ship their devices to us via Aramex or Egypt Post.
        </p>

      </section>


      {/* SHIPPING OPTIONS */}
      <section id="shipping" className="py-16 text-center px-6 bg-white">

        <h2 className="text-3xl font-bold">
          Send Your Device For Repair
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Customers from all over Egypt can send their devices
          to Sa7ar Quick Care for professional repair.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10 max-w-4xl mx-auto">

          <div className="border p-6 rounded-lg">
            <h3 className="text-xl font-semibold">
              Ship with Aramex
            </h3>

            <p className="text-gray-600 mt-2">
              Send your device safely through Aramex
              from anywhere in Egypt.
            </p>
          </div>

          <div className="border p-6 rounded-lg">
            <h3 className="text-xl font-semibold">
              Ship with Egypt Post
            </h3>

            <p className="text-gray-600 mt-2">
              You can also send your device through
              Egypt Post to our repair center in Cairo.
            </p>
          </div>

        </div>

      </section>

<section className="max-w-6xl mx-auto px-6 py-16">

  <h2 className="text-2xl font-semibold mb-8 text-center">
    Popular Repairs
  </h2>

  <div className="grid md:grid-cols-4 gap-6">

    <div className="border rounded-xl p-6 hover:shadow transition">
      <h3 className="font-semibold mb-2">
        JBL Speaker Charging Port Repair
      </h3>
      <p className="text-gray-600 text-sm">
        Fix charging problems for JBL PartyBox, Flip, and other speakers.
      </p>
    </div>

    <div className="border rounded-xl p-6 hover:shadow transition">
      <h3 className="font-semibold mb-2">
        AirPods Battery Replacement
      </h3>
      <p className="text-gray-600 text-sm">
        Replace weak AirPods batteries and restore listening time.
      </p>
    </div>

    <div className="border rounded-xl p-6 hover:shadow transition">
      <h3 className="font-semibold mb-2">
        iPhone Charging Port Repair
      </h3>
      <p className="text-gray-600 text-sm">
        Fix iPhone charging issues caused by damaged charging ports.
      </p>
    </div>

    <div className="border rounded-xl p-6 hover:shadow transition">
      <h3 className="font-semibold mb-2">
        Apple Pencil Not Charging
      </h3>
      <p className="text-gray-600 text-sm">
        Repair Apple Pencil charging and connection problems.
      </p>
    </div>

  </div>

</section>

      

    </main>
  );
}