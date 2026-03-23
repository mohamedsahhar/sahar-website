import Link from "next/link";

export const metadata = {
  title: "صيانة الموبايل والإلكترونيات في القاهرة | سحار كويك كير",
  description:
    "مركز سحار كويك كير يقدم خدمات صيانة احترافية للموبايلات وسماعات AirPods وJBL وأجهزة Apple في القاهرة.",
};

export default function ArabicHome() {
  return (
    <section dir="rtl" className="min-h-screen bg-white text-right py-20 px-4">

      <div className="max-w-3xl mx-auto text-center">

        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          صيانة الموبايل والإلكترونيات في القاهرة
        </h1>

        <p className="text-gray-600 mb-6">
          موبايلات • سماعات • مكانس ذكية • AirPods
        </p>

        <p className="text-gray-500 mb-6 leading-relaxed">
          يقدم مركز سحار كويك كير خدمات صيانة احترافية لجميع الأجهزة الإلكترونية في القاهرة،
          بما في ذلك تصليح الآيفون وصيانة سماعات AirPods وإصلاح سماعات JBL وصيانة قلم Apple Pencil.
        </p>

        <a
          href="https://wa.me/201021024094"
          target="_blank"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          تواصل معنا عبر واتساب
        </a>

        <div className="mt-6 flex justify-center gap-4 text-sm text-blue-600">
          <Link href="/cases">حالات الصيانة</Link>
          <Link href="/devices">الأجهزة</Link>
          <Link href="/repairs">العلامات التجارية</Link>
        </div>

      </div>

    </section>
  );
}