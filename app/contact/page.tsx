export default function Contact() {
  return (
    <main className="min-h-screen p-10 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold text-center mb-10">
        Contact Sa7ar Quick Care
      </h1>

      <div className="flex flex-col gap-6 text-lg">

        <div>
          <h2 className="font-semibold">Phone</h2>
          <p>+20 102102494</p>
        </div>

        <div>
          <h2 className="font-semibold">WhatsApp</h2>
          <p>
            Contact us directly on WhatsApp for repair inquiries.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Location</h2>
          <p>Cairo, Egypt</p>
        </div>

        <div>
          <h2 className="font-semibold">Shipping</h2>
          <p>
            Customers from all over Egypt can ship devices
            to us via Aramex or Egypt Post.
          </p>
        </div>

      </div>

    </main>
  );
}