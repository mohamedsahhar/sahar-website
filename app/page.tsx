export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      <section className="text-center py-20 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">
          Sa7ar Quick Care
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          Professional Electronics Repair Across Egypt
        </p>

        <p className="mt-2 text-gray-500">
          Phones, Robot Vacuums, Speakers, AirPods & More
        </p>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-10">

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-xl">
              Robot Vacuum Repair
            </h3>
            <p className="text-gray-500 mt-2">
              Xiaomi, Roborock, Ecovacs and more
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-xl">
              Speaker Repair
            </h3>
            <p className="text-gray-500 mt-2">
              JBL, Bose, Harman Kardon
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-xl">
              Phone & AirPods Repair
            </h3>
            <p className="text-gray-500 mt-2">
              Screen, battery and motherboard repair
            </p>
          </div>

        </div>
      </section>

      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold">
          Nationwide Repair Service
        </h2>

        <p className="mt-4 text-gray-600">
          Customers from all over Egypt can ship their devices to us via Aramex or Egypt Post.
        </p>
      </section>
<section className="py-16 text-center px-6 bg-white">

  <h2 className="text-3xl font-bold">
    Send Your Device For Repair
  </h2>

  <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
    Customers from all over Egypt can send their devices
    to Sa7ar Quick Care for professional repair.
  </p>

  <div className="grid md:grid-cols-2 gap-8 mt-10 max-w-4xl mx-auto">

    <div className="border p-6 rounded-lg">
      <h3 className="text-xl font-semibold">
        Ship with Aramex
      </h3>

      <p className="text-gray-600 mt-2">
        Send your device safely through Aramex
        from anywhere in Egypt.
      </p>
    </div>

    <div className="border p-6 rounded-lg">
      <h3 className="text-xl font-semibold">
        Ship with Egypt Post
      </h3>

      <p className="text-gray-600 mt-2">
        You can also send your device through
        Egypt Post to our repair center in Cairo.
      </p>
    </div>

  </div>

</section>
    </main>
  );
}