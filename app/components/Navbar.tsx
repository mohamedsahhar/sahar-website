"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-white shadow-md px-6 py-4">

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
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

        {/* Desktop Menu */}
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

          <Link href="/services" className="hover:text-black transition">
            Services
          </Link>

          <Link href="/contact" className="hover:text-black transition">
            Contact
          </Link>

          {/* CTA Button */}
          <Link
            href="/repair-request"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Request Repair
          </Link>

          {/* 🌍 Language Switch */}
<div className="flex items-center gap-2 ml-4 text-sm">
  <Link href="/" className="hover:text-black">EN</Link>
  <span>|</span>
  <Link href="/ar" className="hover:text-black">عربي</Link>
</div>
        </div>

        {/* Mobile Button */}
        <button
          aria-label="Open menu"
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
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

          <Link href="/services" onClick={closeMenu}>
            Services
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
{/* 🌍 Language Switch */}
<div className="flex gap-3 pt-4 border-t">
  <Link href="/" onClick={closeMenu}>EN</Link>
  <Link href="/ar" onClick={closeMenu}>عربي</Link>
</div>
        </div>
      )}

    </nav>
  )
}