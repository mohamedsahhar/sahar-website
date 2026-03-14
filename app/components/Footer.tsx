import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Sa7ar Quick Care
          </h3>

          <p className="text-gray-600 text-sm">
            Professional repair services for smartphones, headphones,
            Bluetooth speakers, Apple Pencil, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">

          <h3 className="text-lg font-semibold mb-2">
            Quick Links
          </h3>

          <Link href="/" className="text-gray-600 hover:text-black">
            Home
          </Link>

          <Link href="/repairs" className="text-gray-600 hover:text-black">
            Repairs
          </Link>

          <Link href="/devices" className="text-gray-600 hover:text-black">
            Devices
          </Link>

          <Link href="/cases" className="text-gray-600 hover:text-black">
            Repair Cases
          </Link>

          <Link href="/contact" className="text-gray-600 hover:text-black">
            Contact
          </Link>

        </div>

        {/* Contact */}
        <div>

          <h3 className="text-lg font-semibold mb-2">
            Contact
          </h3>

          <p className="text-gray-600 text-sm mb-2">
            Cairo, Egypt
          </p>

          <a
            href="https://wa.me/201021024094"
            className="text-green-600 hover:underline"
          >
            Chat on WhatsApp
          </a>

        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sa7ar Quick Care. All rights reserved.
      </div>

    </footer>
  )
}