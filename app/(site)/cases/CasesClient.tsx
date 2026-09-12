"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getSmartSearchScore } from "@/lib/search"

export default function CasesClient({ cases }: { cases: any[] }) {
  const [search, setSearch] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedDevice, setSelectedDevice] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
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

  const featuredServices = useMemo(() => {
    const findThumbnail = (matcher: (repairCase: any) => boolean) =>
      cases.find((repairCase) => matcher(repairCase))?.thumbnail ||
      "/repairs/placeholder.jpg"

    return [
      {
        label: "Coffee Machine Repair",
        query: "coffee machine",
        thumbnail: findThumbnail((repairCase) =>
          /coffee|espresso|nespresso|smeg/i.test(
            [repairCase.title, repairCase.device?.brand?.name, repairCase.device?.name]
              .filter(Boolean)
              .join(" ")
          )
        ),
      },
      {
        label: "SMEG Repair",
        query: "SMEG",
        thumbnail: findThumbnail(
          (repairCase) => repairCase.device?.brand?.name?.toLowerCase() === "smeg"
        ),
      },
      {
        label: "Ninja Appliance Repair",
        query: "Ninja",
        thumbnail: findThumbnail(
          (repairCase) => repairCase.device?.brand?.name?.toLowerCase() === "ninja"
        ),
      },
      {
        label: "Dyson Vacuum Repair",
        query: "Dyson",
        thumbnail: findThumbnail(
          (repairCase) => repairCase.device?.brand?.name?.toLowerCase() === "dyson"
        ),
      },
    ]
  }, [cases])

  const rankedCases = useMemo(() => {
    const query = search.trim()

    return cases
      .map((repairCase) => {
        const fields = [
          { value: repairCase.title, weight: 8 },
          { value: repairCase.device?.brand?.name, weight: 6 },
          { value: repairCase.device?.name, weight: 6 },
          { value: repairCase.problem, weight: 4 },
          { value: repairCase.solution, weight: 3 },
          { value: repairCase.repairTime, weight: 2 },
          { value: repairCase.slug, weight: 1 },
        ]
        const completeCaseText = fields
          .map((field) => field.value)
          .filter(Boolean)
          .join(" ")
        const completeCaseScore = getSmartSearchScore(query, completeCaseText)
        const fieldScore = fields.reduce((total, field) => {
          const score = getSmartSearchScore(query, String(field.value || ""))
          return score >= 0 ? total + score * field.weight : total
        }, 0)

        return {
          repairCase,
          searchScore: completeCaseScore < 0 ? -1 : completeCaseScore + fieldScore,
        }
      })
      .filter(({ repairCase, searchScore }) => {
        const matchesBrand = selectedBrand
          ? repairCase.device?.brand?.name === selectedBrand
          : true
        const matchesDevice = selectedDevice
          ? repairCase.device?.name === selectedDevice
          : true

        return searchScore >= 0 && matchesBrand && matchesDevice
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.repairCase.createdAt).getTime() - new Date(b.repairCase.createdAt).getTime()
        }

        if (sortBy === "title") {
          return String(a.repairCase.title).localeCompare(String(b.repairCase.title))
        }

        if (sortBy === "newest") {
          return new Date(b.repairCase.createdAt).getTime() - new Date(a.repairCase.createdAt).getTime()
        }

        if (query && b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore
        }

        const featuredDifference =
          Number(featuredSlugs.includes(b.repairCase.slug)) -
          Number(featuredSlugs.includes(a.repairCase.slug))

        return featuredDifference ||
          new Date(b.repairCase.createdAt).getTime() - new Date(a.repairCase.createdAt).getTime()
      })
  }, [cases, search, selectedBrand, selectedDevice, sortBy])

  const sortedCases = rankedCases.map(({ repairCase }) => repairCase)

  const visibleCases = sortedCases.slice(0, visibleCount)

  return (
    <>
      <section className="mb-6" aria-labelledby="featured-repair-services">
        <h2 id="featured-repair-services" className="text-xl font-bold mb-3">
          Featured Repair Services
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {featuredServices.map((service) => (
            <button
              key={service.label}
              type="button"
              onClick={() => {
                setSearch(service.query)
                setSelectedBrand("")
                setSelectedDevice("")
                setSortBy("recommended")
                setVisibleCount(6)
              }}
              className="group flex min-h-20 items-center gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md sm:gap-3 sm:p-3"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-14 sm:w-16">
                <Image
                  src={service.thumbnail}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <strong className="flex min-w-0 flex-1 items-center justify-between gap-1 text-sm leading-tight sm:gap-2 sm:text-base">
                {service.label}
                <span className="text-2xl font-normal text-orange-500 transition group-hover:translate-x-1" aria-hidden="true">
                  ›
                </span>
              </strong>
            </button>
          ))}
        </div>
      </section>

      <div className="mb-6">
        <label htmlFor="case-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search repair cases
        </label>
        <input
          id="case-search"
          type="text"
          placeholder="Try a brand, device, problem, or solution..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setVisibleCount(6)
          }}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 mt-3">
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Brand
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value)
              setSelectedDevice("")
              setVisibleCount(6)
            }}
            className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-orange-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={String(brand)} value={String(brand)}>
                {String(brand)}
              </option>
            ))}
          </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Device
          <select
            value={selectedDevice}
            onChange={(e) => {
              setSelectedDevice(e.target.value)
              setVisibleCount(6)
            }}
            className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-orange-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          >
            <option value="">All Devices</option>
            {devices.map((device) => (
              <option key={String(device)} value={String(device)}>
                {String(device)}
              </option>
            ))}
          </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-gray-700">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setVisibleCount(6)
              }}
              className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-orange-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            >
              <option value="recommended">Best match</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>

          <button
            onClick={() => {
              setSearch("")
              setSelectedBrand("")
              setSelectedDevice("")
              setSortBy("recommended")
              setVisibleCount(6)
            }}
            className="self-end px-4 py-2 rounded-2xl border border-gray-300 hover:border-black hover:bg-black hover:text-white transition"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-500" aria-live="polite">
          <strong className="text-base text-gray-900">{sortedCases.length}</strong>{" "}
          {sortedCases.length === 1 ? "repair case" : "repair cases"}
          {search.trim() ? ` matching “${search.trim()}”` : ""}
        </div>
      </div>

      {sortedCases.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          No repair cases match your filters.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCases.map((c: any) => (
          <div
            key={c.slug}
            className="group relative border border-gray-200 rounded-2xl overflow-hidden bg-white hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg transition duration-300"
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
                className="inline-block mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
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
            className="px-6 py-3 border border-gray-300 rounded-2xl hover:border-black hover:bg-black hover:text-white transition"
          >
            Load More
          </button>
        </div>
      )}
    </>
  )
}
