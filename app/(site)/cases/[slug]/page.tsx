import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import LightboxImage from "@/app/components/LightboxImage";

export const dynamic = "force-dynamic";

//////////////////////////////////////////////////////
// Metadata
//////////////////////////////////////////////////////
export async function generateMetadata({
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

  if (!repair) {
    return {
      title: "Repair | Sa7ar Quick Care",
    };
  }

  const deviceName = repair.device
    ? `${repair.device.brand?.name ?? ""} ${repair.device.name}`
    : "Device";

  const title = `${repair.title} | Sa7ar Quick Care`;

  const description = `Professional repair service for ${deviceName}. ${
    repair.problem?.slice(0, 120) ?? ""
  }`;

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

//////////////////////////////////////////////////////
// Page
//////////////////////////////////////////////////////
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

  const deviceName = repair.device
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
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-8 md:py-8">

      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        {repair.title}
      </h1>

      <p className="text-gray-700 mb-4">
        Professional repair service for {deviceName} in New Cairo.
      </p>

      {/* CTA */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">

        <a
          href={`https://wa.me/201021024094?text=${whatsappMessage}`}
          target="_blank"
          className="bg-green-600 text-white px-5 py-3 rounded-xl font-medium text-center hover:bg-green-700 transition"
        >
          Ask About Similar Repair
        </a>

        <Link
          href="/repair-request"
          className="bg-black text-white px-5 py-3 rounded-xl font-medium text-center hover:bg-gray-800 transition"
        >
          Book Repair Appointment
        </Link>

      </div>

      {/* Internal Links */}
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

      {/* Optimized Gallery */}
      {galleryImages.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img: string, index: number) => (
            <div
              key={index}
              className="h-72 md:h-72 overflow-hidden rounded-xl"
            >
              <LightboxImage
                src={img}
                alt={`${repair.title} image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
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

      </div>

      {/* Related Repairs */}
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
                className="group border rounded-xl p-5 bg-white hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900 mb-2">
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

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-3 md:hidden">
        <a
          href={`https://wa.me/201021024094?text=${whatsappMessage}`}
          target="_blank"
          className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-semibold"
        >
          WhatsApp for Similar Repair
        </a>
      </div>

    </div>
  );
}