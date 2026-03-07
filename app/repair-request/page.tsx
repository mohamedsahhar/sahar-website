export default function RepairRequest() {
  return (
    <main className="min-h-screen p-10 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold text-center mb-8">
        Request a Repair
      </h1>

      <form className="flex flex-col gap-4">

        <input
          className="border p-3 rounded"
          placeholder="Your Name"
        />

        <input
          className="border p-3 rounded"
          placeholder="Phone Number"
        />

        <input
          className="border p-3 rounded"
          placeholder="Device Type (Phone, Robot Vacuum, Speaker...)"
        />

        <input
          className="border p-3 rounded"
          placeholder="Brand / Model"
        />

        <textarea
          className="border p-3 rounded"
          placeholder="Describe the problem"
          rows={4}
        />

        <button className="bg-black text-white p-3 rounded">
          Submit Repair Request
        </button>

      </form>

    </main>
  );
}