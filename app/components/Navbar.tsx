export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
<img src="/sahar-transparent-black.png" alt="Sa7ar Quick Care" width="160" />
      <div className="text-xl font-bold">
        Sa7ar Quick Care
      </div>

      <div className="flex gap-6 text-gray-700">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/repair-request">Repair Request</a>
        <a href="/contact">Contact</a>
      </div>

    </nav>
  )
}