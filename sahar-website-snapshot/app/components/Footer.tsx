import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-10">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold">
            Sa7ar Quick Care
          </h3>

          <p className="text-gray-400 mt-3">
            Professional electronics repair service specializing in phones,
            speakers, robot vacuums, DJ mixers and modern devices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold">
            Quick Links
          </h3>

          <ul className="mt-3 space-y-2 text-gray-400">

            <li>
              <Link href="/#services" className="hover:text-white">
                Services
              </Link>
            </li>

            <li>
              <Link href="/#reviews" className="hover:text-white">
                Customer Reviews
              </Link>
            </li>

            <li>
              <Link href="/#shipping" className="hover:text-white">
                Shipping Repair
              </Link>
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div>

          <h3 className="text-xl font-semibold">
            Contact Us
          </h3>

          <p className="text-gray-400 mt-3">
            Cairo, Egypt
          </p>

          <div className="flex gap-4 mt-4">

            {/* WhatsApp */}
            <a
              href="https://wa.me/201021024094"
              target="_blank"
              className="hover:opacity-80"
            >
              <img
                src="/whatsapp.svg"
                alt="WhatsApp"
                className="w-5 h-5"
              />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/sa7ar.quick.care/"
              target="_blank"
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/sa7ar_quick_care/"
              target="_blank"
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@sa7arquickcare"
              target="_blank"
              className="hover:opacity-80"
            >
              <img
                src="/tiktok.svg"
                alt="TikTok"
                className="w-5 h-5"
              />
            </a>

          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 mt-10 text-sm">
        © {new Date().getFullYear()} Sa7ar Quick Care. All rights reserved.
      </div>

    </footer>
  );
}