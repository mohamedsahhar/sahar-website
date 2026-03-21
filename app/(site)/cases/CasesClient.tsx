"use client";

import { useState } from "react";
import Link from "next/link";

export default function CasesClient({ cases }: { cases: any[] }) {

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

  // Extract all brands
  const brands = [
    ...new Set(
      cases
        .map(c => c.device?.brand?.name)
        .filter(Boolean)
    )
  ];

  // Extract devices (dependent on selectedBrand)
  const devices = [
    ...new Set(
      cases
        .filter(c =>
          selectedBrand
            ? c.device?.brand?.name === selectedBrand
            : true
        )
        .map(c => c.device?.name)
        .filter(Boolean)
    )
  ];

  // Filtering logic
  const filteredCases = cases.filter(c => {

    const brandName = c.device?.brand?.name;
    const deviceName = c.device?.name;

    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.problem?.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = selectedBrand ? brandName === selectedBrand : true;
    const matchesDevice = selectedDevice ? deviceName === selectedDevice : true;

    return matchesSearch && matchesBrand && matchesDevice;
  });
console.log(cases.map(c => c.slug))

  return (
    <>
      {/* Filters */}
      <div className="mb-10">

        {/* Search */}
        <input
          type="text"
          placeholder="Search repair cases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Dropdowns */}
        <div className="flex gap-3 flex-wrap mt-4">

          {/* Brand */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedDevice("");
            }}
            className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-black transition"
          >
            <option value="">All Brands</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          {/* Device */}
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="border border-gray-200 rounded-2xl px-4 py-2 bg-white hover:border-black transition"
          >
            <option value="">All Devices</option>
            {devices.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>

          {/* Clear */}
          <button
            onClick={() => {
              setSearch("");
              setSelectedBrand("");
              setSelectedDevice("");
            }}
            className="px-4 py-2 rounded-2xl border hover:bg-black hover:text-white transition"
          >
            Clear
          </button>

        </div>
      </div>

      {/* Empty */}
      {filteredCases.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          No repair cases match your filters.
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCases.map((c: any) => (
          <div
            key={c.slug} // ✅ FIXED HERE
            className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition duration-300"
          >

            {c.image && (
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">

              <h2 className="font-semibold text-lg line-clamp-2">
                {c.title}
              </h2>

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
    </>
  );
}