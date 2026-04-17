"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CasesClient({ cases }: { cases: any[] }) {

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const featuredSlugs = [
    "jbl-partybox-310-charging-port-repair",
    "iphone-11-motherboard-repair",
    "airpods-pro-battery-replacement"
  ];

  const brands = [
    ...new Set(cases.map(c => c.device?.brand?.name).filter(Boolean))
  ];

  const devices = [
    ...new Set(
      cases
        .filter(c =>
          selectedBrand ? c.device?.brand?.name === selectedBrand : true
        )
        .map(c => c.device?.name)
        .filter(Boolean)
    )
  ];

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.problem?.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = selectedBrand
      ? c.device?.brand?.name === selectedBrand
      : true;

    const matchesDevice = selectedDevice
      ? c.device?.name === selectedDevice
      : true;

    return matchesSearch && matchesBrand && matchesDevice;
  });

  const sortedCases = [
    ...filteredCases.filter(c => featuredSlugs.includes(c.slug)),
    ...filteredCases.filter(c => !featuredSlugs.includes(c.slug)),
  ];

  const visibleCases = sortedCases.slice(0, visibleCount);

  return (
    <>
      <div className="mb-10">

        <input
          type="text"
          placeholder="Search repair cases..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(6);
          }}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3"
        />

        <div className="flex gap-3 flex-wrap mt-4">

          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedDevice("");
              setVisibleCount(6);
            }}
            className="border rounded-2xl px-4 py-2"
          >
            <option value="">All Brands</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedDevice}
            onChange={(e) => {
              setSelectedDevice(e.target.value);
              setVisibleCount(6);
            }}
            className="border rounded-2xl px-4 py-2"
          >
            <option value="">All Devices</option>
            {devices.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSelectedBrand("");
              setSelectedDevice("");
              setVisibleCount(6);
            }}
            className="px-4 py-2 rounded-2xl border"
          >
            Clear
          </button>

        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-60 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {visibleCases.map((c: any) => {

              const whatsappMessage = encodeURIComponent(
                `Hi, I saw your repair case "${c.title}" and I want similar repair.`
              );

              return (
                <div
                  key={c.slug}
                  className="group relative border rounded-2xl overflow-hidden hover:shadow-xl transition"
                >

                  {featuredSlugs.includes(c.slug) && (
                    <div className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}

                  {/* ✅ CLICKABLE IMAGE */}
                  {c.thumbnail && (
                    <Link href={`/cases/${c.slug}`}>
                      <div className="relative w-full h-48 overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 group-hover:scale-105 transition">
                          <Image
                            src={c.thumbnail}
                            alt={c.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </Link>
                  )}

                  <div className="p-5 space-y-2">

                    {/* ✅ CLICKABLE TITLE */}
                    <Link href={`/cases/${c.slug}`}>
                      <h2 className="font-semibold text-lg cursor-pointer hover:underline">
                        {c.title}
                      </h2>
                    </Link>

                    <p className="text-gray-400 text-sm">
                      {c.device?.brand?.name} • {c.device?.name}
                    </p>

                    {/* CTA */}
                    <a
                      href={`https://wa.me/201021024094?text=${whatsappMessage}`}
                      target="_blank"
                      className="block mt-3 text-center bg-black text-white py-2 rounded-xl text-sm hover:opacity-90 transition"
                    >
                      Request Similar Repair
                    </a>

                  </div>

                </div>
              );
            })}

          </div>

          {visibleCount < sortedCases.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-6 py-3 border rounded-2xl"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}