"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const linkClass = (path: string) =>
    pathname === path
      ? "text-green-600 font-semibold border-b-2 border-green-600 pb-0.5"
      : "hover:text-black transition"

  return (
    <nav
      className={`sticky top-0 z-50 px-6 py-1.5 md:py-2 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
  src="/sahar-transparent-black.png"
  alt="Sa7ar Quick Care"
  width={132}
  height={34}
  className="h-14 md:h-16 w-auto object-contain"
  priority
/>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 text-[15px] text-gray-700 font-medium">

          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <Link href="/cases" className={linkClass("/cases")}>
            Repair Cases
          </Link>

          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>

          <Link
            href="/repair-request"
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition text-sm"
          >
            Request Repair
          </Link>

          <div className="flex items-center gap-2 ml-3 text-sm">
            <Link href="/" className="hover:text-black">
              EN
            </Link>

            <span>|</span>

            <Link href="/ar" className="hover:text-black">
              عربي
            </Link>
          </div>

        </div>

        {/* Mobile Button */}
        <button
          aria-label="Open menu"
          className="md:hidden text-3xl leading-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t pt-3 flex flex-col gap-4 text-gray-700 font-medium">

          <Link href="/" onClick={closeMenu}>
            Home
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
            className="bg-green-600 text-white text-center px-4 py-2 rounded-lg"
          >
            Request Repair
          </Link>

          <div className="flex gap-3 pt-3 border-t">
            <Link href="/" onClick={closeMenu}>
              EN
            </Link>

            <Link href="/ar" onClick={closeMenu}>
              عربي
            </Link>
          </div>

        </div>
      )}

    </nav>
  )
}