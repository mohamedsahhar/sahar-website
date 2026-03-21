import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function RepairPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const repair = await prisma.repairCase.findUnique({
    where: {
      slug: slug,
    },
    include: {
      device: {
        include: {
          brand: true
        }
      }
    }
  })

  if (!repair) {
    return <p>Repair case not found.</p>
  }

  const deviceName =
    repair.device
      ? `${repair.device.brand?.name ?? ""} ${repair.device.name}`
      : "Device"

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">
        {repair.title}
      </h1>

      <p className="text-gray-600 mb-6">
        Repair service for {deviceName} at Sa7ar Quick Care.
      </p>

      {repair.image && (
        <Image
          src={repair.image}
          alt={repair.title}
          width={800}
          height={500}
          className="rounded-lg mb-6"
        />
      )}

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

    </div>
  )
}