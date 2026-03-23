import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
export const dynamic = "force-dynamic";
// SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const repair = await prisma.repairCase.findFirst({
    where: { slug },
    include: {
      device: {
        include: {
          brand: true
        }
      }
    }
  })

  if (!repair) {
    return {
      title: "Repair Not Found | Sa7ar Quick Care",
      description: "The requested repair case could not be found.",
    }
  }

  const deviceName =
    repair.device
      ? `${repair.device.brand?.name ?? ""} ${repair.device.name}`
      : "Device"

  const title = `${deviceName} Repair in Cairo | ${repair.problem} Fix - Sa7ar Quick Care`

  const description = `We fixed ${deviceName} issue: ${repair.problem}. Professional ${deviceName} repair service in Cairo, Egypt. Fast and reliable service at Sa7ar Quick Care.`;
 const brandName = repair.device?.brand?.name || ""
  const relatedRepairs = await prisma.repairCase.findMany({
  where: {
    deviceId: repair.deviceId,
    NOT: {
      id: repair.id,
    },
  },
  take: 3,
});
 return {
  title,
  description,

  alternates: {
    canonical: `/cases/${slug}`,
  },

  keywords: [
    `${deviceName} repair Cairo`,
    `${deviceName} repair Egypt`,
    `${brandName || ""} repair`,
  ],

  openGraph: {
    title,
    description,
    url: `/cases/${slug}`,
    type: "article",
    images: repair.image
      ? [
          {
            url: repair.image,
            width: 1200,
            height: 630,
            alt: repair.title,
          },
        ]
      : [],
  },
}
}

// PAGE
export default async function RepairPage({
  
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const repair = await prisma.repairCase.findFirst({
    where: { slug },
    include: {
      device: {
        include: {
          brand: true
        }
      }
    }
  })

  if (!repair) {
    notFound()
  }

  const deviceName =
    repair.device
      ? `${repair.device.brand?.name ?? ""} ${repair.device.name}`
      
      : "Device"
const relatedRepairs = await prisma.repairCase.findMany({
  where: {
    deviceId: repair.deviceId,
    NOT: {
      id: repair.id,
    },
  },
  take: 3,
});
  const deviceSlug = repair.device?.slug
  const brandName = repair.device?.brand?.name

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        {repair.title}
      </h1>

      <p className="text-gray-600 mb-3">
        Professional repair service for {deviceName} in New Cairo at Sa7ar Quick Care.
      </p>

      {/* ✅ INTERNAL LINKS */}
      <div className="mb-6 text-sm text-gray-500 flex flex-wrap gap-3">

        {deviceSlug && (
          <Link
            href={`/devices/${deviceSlug}`}
            className="underline hover:text-blue-600"
          >
            View all {deviceName} repairs
          </Link>
        )}

        {brandName && (
          <Link
            href={`/repairs/${brandName.toLowerCase()}`}
            className="underline hover:text-blue-600"
          >
            View all {brandName} repairs
          </Link>
        )}

      </div>

      {/* ✅ MAIN IMAGE */}
      {repair.image && (
        <Image
          src={repair.image}
          alt={repair.title}
          width={800}
          height={500}
          className="rounded-lg mb-6"
        />
      )}

      {/* BEFORE & AFTER */}
      {(repair.beforeImage || repair.afterImage) && (
        <div className="mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Before & After Repair
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {repair.beforeImage && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Before</p>
                <img
                  src={repair.beforeImage}
                  alt="Before repair"
                  className="rounded-lg w-full"
                />
              </div>
            )}

            {repair.afterImage && (
              <div>
                <p className="text-sm text-gray-500 mb-1">After</p>
                <img
                  src={repair.afterImage}
                  alt="After repair"
                  className="rounded-lg w-full"
                />
              </div>
            )}

          </div>

        </div>
      )}

      {/* VIDEO */}
      {repair.videoUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Repair Video
          </h2>

          <a
            href={repair.videoUrl}
            target="_blank"
            className="text-blue-600 underline"
          >
            Watch Video
          </a>
        </div>
      )}

      {/* CONTENT */}
      <div className="space-y-6">

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Problem
          </h2>
          <p className="text-gray-700">
            {repair.problem}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Solution
          </h2>
          <p className="text-gray-700">
            {repair.solution}
          </p>
        </div>

        {repair.repairTime && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Repair Time
            </h2>
            <p className="text-gray-700">
              {repair.repairTime}
            </p>
          </div>
        )}

      </div>

      {/* ✅ NEW: CALL TO ACTION (VERY IMPORTANT) */}
      <div className="mt-10 p-6 bg-gray-100 rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-2">
          Need a similar repair?
        </h3>
        <p className="text-gray-600 mb-4">
          Contact Sa7ar Quick Care for fast and professional repair service in New Cairo.
        </p>
        <a
          href="https://wa.me/201021024094"
          target="_blank"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Contact us on WhatsApp
        </a>
      </div>
      {/* 🔥 RELATED REPAIRS */}
{relatedRepairs.length > 0 && (
  <div className="mt-12">
    <h2 className="text-xl font-semibold mb-4">
      Related Repairs
    </h2>

    <div className="grid gap-4">
      {relatedRepairs.map((item: any) => (
        <Link
          key={item.id}
          href={`/cases/${item.slug}`}
          className="block p-4 border rounded-lg hover:bg-gray-50"
        >
          <p className="font-medium">
            {item.title}
          </p>
        </Link>
      ))}
    </div>
  </div>
)}

    </div>
  )
}