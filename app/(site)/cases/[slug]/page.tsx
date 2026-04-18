import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import LightboxImage from "@/app/components/LightboxImage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const repair = await prisma.repairCase.findFirst({
    where: { slug: params.slug },
    include: {
      device: {
        include: { brand: true },
      },
    },
  });

  if (!repair) {
    return {
      title: "Repair | Sa7ar Quick Care",
    };
  }

  const deviceName = repair.device
    ? `${repair.device.brand?.name ?? ""} ${repair.device.name}`
    : "Device";

  const title = `${repair.title} | Sa7ar Quick Care`;

  const description = `Professional repair service for ${deviceName}. ${repair.problem?.slice(0, 120) ?? ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: repair.images?.length ? [repair.images[0]] : [],
    },
  };
}

export default async function RepairPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const repair = await prisma.repairCase.findFirst({
    where: { slug },
    include: {
      device: {
        include: { brand: true },
      },
    },
  });

  if (!repair) notFound();

  const relatedRepairs = await prisma.repairCase.findMany({
    where: {
      deviceId: repair.deviceId,
      NOT: { id: repair.id },
    },
    take: 3,
  });

  const deviceName =
    repair.device
      ? `${repair.device.brand?.name ?? ""} ${repair.device.name}`
      : "Device";

  const deviceSlug = repair.device?.slug;
  const brandName = repair.device?.brand?.name;

  const galleryImages = repair.images || [];

  const whatsappMessage = encodeURIComponent(
    `Hello Sa7ar Quick Care,

I saw your repair case "${repair.title}" and I would like a similar repair.

Device: ${deviceName}

Please let me know availability and estimated cost.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-8 md:py-8">

      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        {repair.title}
      </h1>

      <p className="text-gray-700 mb-3">
        Professional repair service for {deviceName} in New Cairo.
      </p>

      {/* LINKS */}
      <div className="mb-6 text-sm text-gray-600 flex flex-wrap gap-3">

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

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img: string, index: number) => (
            <div key={index} className="h-72 md:h-auto overflow-hidden rounded-xl">
              <LightboxImage
                src={img}
                alt={`${repair.title} image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* VIDEO */}
      {repair.videoUrl && (
        <div className="mb-8">

          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Repair Video
          </h2>

          <a
            href={repair.videoUrl}
            target="_blank"
            className="inline-block group"
          >
            <div className="w-64 sm:w-72 aspect-video rounded-xl overflow-hidden border bg-gray-100 relative">

              {galleryImages[0] && (
                <img
                  src={galleryImages[0]}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-2">
              Watch on Instagram
            </p>

          </a>

        </div>
      )}

      {/* CONTENT */}
      <div className="space-y-6">

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Problem
          </h2>
          <p className="text-gray-700">
            {repair.problem}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Solution
          </h2>
          <p className="text-gray-700">
            {repair.solution}
          </p>
        </div>

        {repair.repairTime && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Repair Time
            </h2>
            <p className="text-gray-700">
              {repair.repairTime}
            </p>
          </div>
        )}

      </div>

      {/* CTA */}
      <div className="mt-10 p-6 bg-gray-100 rounded-xl text-center border">

        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          Need a similar repair?
        </h3>

        <p className="text-gray-600 mb-5">
          Fast diagnostics, professional service, and quick WhatsApp response.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">

          <a
            href={`https://wa.me/201021024094?text=${whatsappMessage}`}
            target="_blank"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Get Similar Repair on WhatsApp
          </a>

          <a
            href="/repair-request"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Book Repair Appointment
          </a>

        </div>

        <p className="text-sm text-gray-500 mt-4">
          No obligation consultation • Located in New Cairo
        </p>

      </div>

      {/* RELATED */}
      {relatedRepairs.length > 0 && (
        <div className="mt-12">

          <h2 className="text-xl font-semibold mb-5 text-gray-900">
            Related Repairs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {relatedRepairs.map((item: any) => (
              <Link
                key={item.id}
                href={`/cases/${item.slug}`}
                className="group border rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
              >

                <p className="font-semibold text-gray-900 group-hover:text-green-600 transition mb-2">
                  {item.title}
                </p>

                <p className="text-sm text-gray-500">
                  View repair details →
                </p>

              </Link>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}