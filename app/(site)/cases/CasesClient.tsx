"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { isSmartSearchMatch } from "@/lib/search"

export default function CasesClient({ cases }: { cases: any[] }) {
  const [search, setSearch] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedDevice, setSelectedDevice] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)

  const featuredSlugs = [
    "jbl-partybox-310-charging-port-repair",
    "iphone-11-motherboard-repair",
    "airpods-pro-battery-replacement",
  ]

  const brands = useMemo(
    () =>
      [...new Set(cases.map((c) => c.device?.brand?.name).filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b))),
    [cases]
  )

  const devices = useMemo(
    () =>
      [
        ...new Set(
          cases
            .filter((c) =>
              selectedBrand ? c.device?.brand?.name === selectedBrand : true
            )
            .map((c) => c.device?.name)
            .filter(Boolean)
        ),
      ].sort((a, b) => String(a).localeCompare(String(b))),
    [cases, selectedBrand]
  )

  const filteredCases = cases.filter((c) => {
    const matchesSearch = isSmartSearchMatch(
      search,
      [
        c.title,
        c.problem,
        c.slug,
        c.device?.brand?.name,
        c.device?.name,
      ]
        .filter(Boolean)
        .join(" ")
    )

    const matchesBrand = selectedBrand
      ? c.device?.brand?.name === selectedBrand
      : true

    const matchesDevice = selectedDevice
      ? c.device?.name === selectedDevice
      : true

    return matchesSearch && matchesBrand && matchesDevice
  })

  const sortedCases = [
    ...filteredCases.filter((c) => featuredSlugs.includes(c.slug)),
    ...filteredCases.filter((c) => !featuredSlugs.includes(c.slug)),
  ]

  const visibleCases = sortedCases.slice(0, visibleCount)

  return (
    <>
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search repair cases..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setVisibleCount(6)
          }}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex gap-3 flex-wrap mt-4">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value)
              setSelectedDevice("")
              setVisibleCount(6)
            }}
            className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-black transition"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={String(brand)} value={String(brand)}>
                {String(brand)}
              </option>
            ))}
          </select>

          <select
            value={selectedDevice}
            onChange={(e) => {
              setSelectedDevice(e.target.value)
              setVisibleCount(6)
            }}
            className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-black transition"
          >
            <option value="">All Devices</option>
            {devices.map((device) => (
              <option key={String(device)} value={String(device)}>
                {String(device)}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("")
              setSelectedBrand("")
              setSelectedDevice("")
              setVisibleCount(6)
            }}
            className="px-4 py-2 rounded-2xl border hover:bg-black hover:text-white transition"
          >
            Clear
          </button>
        </div>
      </div>

      {filteredCases.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          No repair cases match your filters.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCases.map((c: any) => (
          <div
            key={c.slug}
            className="group relative border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition duration-300"
          >
            {featuredSlugs.includes(c.slug) && (
              <div className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-3 py-1 rounded-full">
                Featured
              </div>
            )}

            {c.thumbnail && (
              <Link href={`/cases/${c.slug}`}>
                <div className="relative w-full h-48 overflow-hidden cursor-pointer">
                  <Image
                    src={c.thumbnail}
                    alt={c.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
              </Link>
            )}

            <div className="p-5">
              <Link href={`/cases/${c.slug}`}>
                <h2 className="font-semibold text-lg line-clamp-2 hover:underline">
                  {c.title}
                </h2>
              </Link>

              <p className="text-gray-500 mt-1 text-sm">
                {c.device?.brand?.name} • {c.device?.name}
              </p>

              <Link
                href={`/cases/${c.slug}`}
                className="inline-block mt-4 text-sm font-medium text-black hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < sortedCases.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-6 py-3 border rounded-2xl hover:bg-black hover:text-white transition"
          >
            Load More
          </button>
        </div>
      )}
    </>
  )
}
