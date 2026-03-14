import WhatsAppButton from "./components/WhatsAppButton";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";
import Footer from "./components/Footer";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sa7ar Quick Care | Professional Device Repair",
  description:
    "Sa7ar Quick Care provides professional repair services for smartphones, headphones, speakers, and electronics. Explore real repair cases and expert fixes.",

  openGraph: {
    title: "Sa7ar Quick Care | Professional Device Repair",
    description:
      "Professional repair services for smartphones, headphones, speakers, and electronics.",
    images: ["/sahar-black-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <Navbar />

<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  {children}
</main>



<WhatsAppButton />
      </body>
    </html>
  );
}
