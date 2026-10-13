"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type SiteLanguage = "ar" | "en"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState<SiteLanguage>("en")
  const pathname = usePathname()
  const isArabicPage = pathname === "/ar" || pathname.startsWith("/ar/")
  const displayLanguage: SiteLanguage = isArabicPage ? "ar" : language
  const isTrackingPage = pathname === "/track" || pathname.startsWith("/track/")
  const englishHref = isTrackingPage ? `${pathname}?lang=en` : "/"
  const arabicHref = isTrackingPage ? `${pathname}?lang=ar` : "/ar"
  const trackingHref = `/track?lang=${displayLanguage}`
  const labels = displayLanguage === "ar"
    ? {
        home: "الرئيسية",
        devices: "الأجهزة",
        services: "خدمات الصيانة",
        cases: "حالات الصيانة",
        shop: "المتجر",
        tracking: "متابعة الصيانة",
        contact: "اتصل بنا",
        request: "اطلب صيانة",
        menu: "فتح القائمة",
        homeAria: "الصفحة الرئيسية لسحار كويك كير",
      }
    : {
        home: "Home",
        devices: "Devices",
        services: "Repair Services",
        cases: "Repair Cases",
        shop: "Shop",
        tracking: "Track Repair",
        contact: "Contact",
        request: "Request Repair",
        menu: "Open menu",
        homeAria: "Sa7ar Quick Care home",
      }

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("sa7ar_language")

    if (storedLanguage === "ar" || storedLanguage === "en") {
      setLanguage(storedLanguage)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const rememberLanguage = (selectedLanguage: SiteLanguage) => {
    window.localStorage.setItem("sa7ar_language", selectedLanguage)
    setLanguage(selectedLanguage)
    closeMenu()
  }

  const linkClass = (path: string) =>
    pathname === path
      ? "rounded-md bg-gray-100 px-3 py-1 text-black font-semibold"
      : "px-3 py-1 hover:text-black transition"

  const trackingClass = isTrackingPage
    ? "rounded-md bg-gray-100 px-3 py-1 text-black font-semibold"
    : "px-3 py-1 hover:text-black transition"

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto min-h-20 flex justify-between items-center">
        <Link
          href={isArabicPage ? "/ar" : "/"}
          className="relative block h-20 w-40 shrink-0 overflow-hidden"
          aria-label={labels.homeAria}
        >
          <Image
            src="/sahar-transparent-black.png"
            alt="Sa7ar Quick Care"
            width={1024}
            height={1024}
            className="absolute -left-[15px] -top-[57px] h-[180px] w-[180px] max-w-none"
            priority
          />
        </Link>

        <div className="hidden lg:flex items-center gap-4 text-gray-700 font-medium">
          <Link href="/" className={linkClass("/")}>
            {labels.home}
          </Link>

          <Link href="/devices" className={linkClass("/devices")}>
            {labels.devices}
          </Link>

          <Link href="/repairs" className={linkClass("/repairs")}>
            {labels.services}
          </Link>

          <Link href="/cases" className={linkClass("/cases")}>
            {labels.cases}
          </Link>

          <Link href="/shop" className={linkClass("/shop")}>
            {labels.shop}
          </Link>

          <Link href={trackingHref} className={trackingClass}>
            {labels.tracking}
          </Link>

          <Link href="/contact" className={linkClass("/contact")}>
            {labels.contact}
          </Link>

          <Link
            href="/repair-request"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {labels.request}
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
          aria-label={labels.menu}
          className="lg:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden mt-2 border-t pt-4 flex flex-col gap-4 text-gray-700 font-medium">
          <Link href="/" onClick={closeMenu} className={linkClass("/")}>
            {labels.home}
          </Link>

          <Link href="/devices" onClick={closeMenu} className={linkClass("/devices")}>
            {labels.devices}
          </Link>

          <Link href="/repairs" onClick={closeMenu} className={linkClass("/repairs")}>
            {labels.services}
          </Link>

          <Link href="/cases" onClick={closeMenu} className={linkClass("/cases")}>
            {labels.cases}
          </Link>

          <Link href="/shop" onClick={closeMenu} className={linkClass("/shop")}>
            {labels.shop}
          </Link>

          <Link href={trackingHref} onClick={closeMenu} className={trackingClass}>
            {labels.tracking}
          </Link>

          <Link href="/contact" onClick={closeMenu} className={linkClass("/contact")}>
            {labels.contact}
          </Link>

          <Link
            href="/repair-request"
            onClick={closeMenu}
            className="bg-green-600 text-white text-center px-4 py-2 rounded-lg"
          >
            {labels.request}
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
