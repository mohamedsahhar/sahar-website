import Link from "next/link"

export const metadata = {
  title: "Contact Sa7ar Quick Care | Electronics Repair Cairo",
  description:
    "Contact Sa7ar Quick Care in Cairo for phone repair, speaker repair, AirPods repair, Apple Pencil repair and electronics repair services.",
}

export default function Contact() {

  const whatsappNumber = "201021024094"

  return (
    <div className="max-w-5xl mx-auto px-4">

      <h1 className="text-3xl font-bold mb-6">
        Contact Sa7ar Quick Care
      </h1>

      <p className="text-gray-600 mb-10">
        Need help with a repair? Contact Sa7ar Quick Care for professional
        electronics repair services including smartphones, headphones,
        Bluetooth speakers, Apple Pencil, and more.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-12">

        {/* Contact Info */}
        <div className="flex flex-col gap-6">

          {/* Phone */}
          <div>
            <h2 className="font-semibold text-lg">Phone</h2>

            <div className="flex flex-col gap-1 text-gray-600">

              <a href="tel:+201021024094" className="hover:text-black transition">
                +20 102 102 4094
              </a>

              <a href="tel:+201210005005" className="hover:text-black transition">
                +20 121 000 5005
              </a>

              <a href="tel:+201208590878" className="hover:text-black transition">
                +20 120 859 0878
              </a>

            </div>
          </div>

          {/* WhatsApp */}
          <div>

            <h2 className="font-semibold text-lg">WhatsApp</h2>

            <p className="text-gray-600 mb-3">
              Contact us directly on WhatsApp for quick repair support.
            </p>

            <Link
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hello, I need a repair service for my device."
              )}`}
              target="_blank"
              className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Chat on WhatsApp
            </Link>

          </div>

          {/* Address */}
          <div>

            <h2 className="font-semibold text-lg">
              Workshop Location
            </h2>

            <p className="text-gray-600">
              Cairo, Egypt , New Cairo , 5th Settlements, First Distric, Life Mall .
            </p>

            <p className="text-gray-600">
              مصر- القاهرة- التجمع الخامس الحى الاول 
              لايف مول بجوار سعودى مسجد الحمد
            </p>

            <Link
              href="https://www.google.com/maps/place/sa7ar+quick+care/@30.0041637,31.4187335,17z/data=!3m1!4b1!4m6!3m5!1s0x14583d534282499b:0x71738e9db973f674!8m2!3d30.0041637!4d31.4213138!16s%2Fg%2F11rgt5pnfn"
              target="_blank"
              className="text-blue-600 hover:underline text-sm mt-1 inline-block"
            >
              Open in Google Maps
            </Link>

          </div>

          {/* Shipping */}
          <div>

            <h2 className="font-semibold text-lg">
              Shipping Repairs
            </h2>

            <p className="text-gray-600">
              Customers from anywhere in Egypt can ship their devices to
              our repair center using Aramex, Bosta, or Egypt Post.
            </p>

          </div>

        </div>

        {/* Google Map */}
        <div className="w-full h-[380px] rounded-xl overflow-hidden border">

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.595713979445!2d31.4187335!3d30.0041637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d534282499b%3A0x71738e9db973f674!2sSa7ar%20Quick%20Care!5e0!3m2!1sen!2seg!4v1710000000000!5m2!1sen!2seg"
            width="100%"
            height="100%"
            loading="lazy"
            title="Sa7ar Quick Care Location Map"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </div>

        <p className="text-sm text-gray-500 mt-3">
          ⭐ Rated on Google Maps — Trusted electronics repair center in New Cairo
        </p>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=30.0041637,31.4213138"
          target="_blank"
          className="inline-block mt-3 text-blue-600 hover:underline"
        >
          Get Directions
        </a>


      </div>

    </div>
  )
}
