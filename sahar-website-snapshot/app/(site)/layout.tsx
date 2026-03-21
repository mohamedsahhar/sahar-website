import WhatsAppButton from "../components/WhatsAppButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}