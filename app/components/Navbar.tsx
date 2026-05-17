"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isTrackingPage = pathname === "/track" || pathname.startsWith("/track/")
  const englishHref = isTrackingPage ? `${pathname}?lang=en` : "/"
  const arabicHref = isTrackingPage ? `${pathname}?lang=ar` : "/ar"

  const closeMenu = () => setMenuOpen(false)
  const rememberLanguage = (language: "ar" | "en") => {
    window.localStorage.setItem("sa7ar_language", language)
    closeMenu()
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/sahar-transparent-black.png"
            alt="Sa7ar Quick Care"
            width={160}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>

          <Link href="/repairs" className="hover:text-black transition">
            Repairs
          </Link>

          <Link href="/devices" className="hover:text-black transition">
            Devices
          </Link>

          <Link href="/cases" className="hover:text-black transition">
            Repair Cases
          </Link>

          <Link href="/contact" className="hover:text-black transition">
            Contact
          </Link>

          <Link
            href="/repair-request"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Request Repair
          </Link>

          <div className="flex items-center gap-2 ml-4 text-sm">
            <Link
              href={englishHref}
              onClick={() => rememberLanguage("en")}
              className="hover:text-black"
            >
              EN
            </Link>
            <span>|</span>
            <Link
              href={arabicHref}
              onClick={() => rememberLanguage("ar")}
              className="hover:text-black"
            >
              عربي
            </Link>
          </div>
        </div>

        <button
          aria-label="Open menu"
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-6 border-t pt-4 flex flex-col gap-4 text-gray-700 font-medium">
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/repairs" onClick={closeMenu}>
            Repairs
          </Link>

          <Link href="/devices" onClick={closeMenu}>
            Devices
          </Link>

          <Link href="/cases" onClick={closeMenu}>
            Repair Cases
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link
            href="/repair-request"
            onClick={closeMenu}
            className="bg-black text-white text-center px-4 py-2 rounded-lg"
          >
            Request Repair
          </Link>

          <div className="flex gap-3 pt-4 border-t">
            <Link href={englishHref} onClick={() => rememberLanguage("en")}>
              EN
            </Link>
            <Link href={arabicHref} onClick={() => rememberLanguage("ar")}>
              عربي
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
