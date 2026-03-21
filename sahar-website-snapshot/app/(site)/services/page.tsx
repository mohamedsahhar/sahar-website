export default function Services() {
  return (
    <main className="min-h-screen p-10">

      <h1 className="text-4xl font-bold text-center mb-12">
        Our Repair Services
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">
            Robot Vacuum Repair
          </h2>
          <p className="text-gray-600 mt-2">
            Professional repair for Xiaomi, Roborock,
            Ecovacs and other smart robot vacuums.
          </p>
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">
            Speaker Repair
          </h2>
          <p className="text-gray-600 mt-2">
            JBL, Bose, Harman Kardon and other
            premium speaker repair services.
          </p>
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">
            iPhone & Smartphone Repair
          </h2>
          <p className="text-gray-600 mt-2">
            Screen replacement, battery repair
            and motherboard troubleshooting.
          </p>
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">
            AirPods Repair
          </h2>
          <p className="text-gray-600 mt-2">
            Battery replacement, charging issues
            and connectivity repairs.
          </p>
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">
            Electronics Repair
          </h2>
          <p className="text-gray-600 mt-2">
            Repair for a wide range of electronic
            devices and smart equipment.
          </p>
        </div>

      </div>

    </main>
  );
}