"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BrandRepairsClient({
  repairs,
}: {
  repairs: any[];
}) {
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleRepairs = repairs.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleRepairs.map((repair: any) => (
          <Link
            key={repair.id}
            href={`/cases/${repair.slug}`}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
          >
            {repair.images?.[0] && (
              <div className="relative w-full h-48">
                <Image
                  src={repair.images[0]}
                  alt={`${repair.device?.brand?.name} ${repair.device?.name} repair`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">
                {repair.title}
              </h2>

              <p className="text-sm text-gray-500">
                {repair.device?.brand?.name} • {repair.device?.name}
              </p>

              {repair.repairTime && (
                <p className="text-sm text-gray-500 mt-1">
                  Repair time: {repair.repairTime}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < repairs.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-6 py-3 border rounded-2xl"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}