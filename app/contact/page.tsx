import Link from "next/link"

export default function Contact() {

  const whatsappNumber = "201021024094"

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Contact Sa7ar Quick Care
      </h1>

      <p className="text-gray-600 mb-10">
        Need help with a repair? Contact Sa7ar Quick Care for professional
        electronics repair services. You can reach us by phone, WhatsApp,
        or visit our workshop in Cairo.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-12">

        {/* Contact Info */}
        <div className="flex flex-col gap-6">

          <div>
            <h2 className="font-semibold text-lg">Phone</h2>
            <p className="text-gray-600">
              +20 102 102 4094
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">WhatsApp</h2>
            <p className="text-gray-600 mb-2">
              Contact us directly on WhatsApp for fast repair support.
            </p>

            <Link
              href={`https://wa.me/${whatsappNumber}`}
              className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Chat on WhatsApp
            </Link>

          </div>

          <div>
            <h2 className="font-semibold text-lg">Location</h2>
            <p className="text-gray-600">
              Cairo, Egypt
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">Shipping Repairs</h2>
            <p className="text-gray-600">
              Customers from all over Egypt can ship their devices to our
              repair center using Aramex or Egypt Post.
            </p>
          </div>

        </div>

        {/* Google Map */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden border">

          <iframe
            src="https://www.google.com/maps?q=Cairo%20Egypt&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
          />

        </div>

      </div>

    </div>
  )
}