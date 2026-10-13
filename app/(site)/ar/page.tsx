import Link from "next/link";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import RelatedNews from "@/app/components/RelatedNews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "صيانة الإلكترونيات في القاهرة الجديدة",
  description: "صيانة الموبايلات والآيفون وAirPods والسماعات والساعات الذكية والأجهزة المنزلية في القاهرة الجديدة لدى سحار كويك كير.",
  alternates: { canonical: "/ar", languages: { en: "/", ar: "/ar" } },
  openGraph: { locale: "ar_EG", url: "/ar" },
};

const repairServices = [
  { label: "صيانة الموبايلات", href: "/cases?q=phone" },
  { label: "صيانة الآيفون وأجهزة Apple", href: "/repairs/apple" },
  { label: "صيانة AirPods والسماعات اللاسلكية", href: "/cases?q=airpods" },
  { label: "صيانة سماعات الرأس", href: "/cases?q=headphone" },
  { label: "صيانة مكبرات الصوت", href: "/cases?q=speaker" },
  { label: "صيانة الساعات الذكية", href: "/cases?q=smartwatch" },
  { label: "صيانة ماكينات القهوة", href: "/cases?q=coffee+machine" },
  { label: "صيانة الأجهزة المنزلية", href: "/cases?q=appliance" },
  { label: "صيانة المكانس الذكية", href: "/cases?q=robot+vacuum" },
  { label: "صيانة السكوتر الكهربائي", href: "/cases?q=scooter" },
  { label: "صيانة أجهزة DJ والصوت", href: "/cases?q=DJ" },
];

export default async function ArabicHome() {
  const [latestCases, repairBrands, businessInfo] = await Promise.all([
    prisma.repairCase.findMany({ orderBy: { createdAt: "desc" }, take: 3, include: { device: { include: { brand: true } } } }),
    prisma.brand.findMany({
      where: { devices: { some: { repairs: { some: {} } } } },
      include: { devices: { select: { _count: { select: { repairs: true } } } } },
    }),
    prisma.businessInfo.findFirst(),
  ]);

  const popularBrands = repairBrands
    .map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      repairCount: brand.devices.reduce((total, device) => total + device._count.repairs, 0),
    }))
    .sort((a, b) => b.repairCount - a.repairCount || a.name.localeCompare(b.name))
    .slice(0, 10);

  const workingHours = businessInfo?.workingHours || "10:00 صباحًا - 10:00 مساءً";
  const daysOff = businessInfo?.daysOff || "الجمعة";
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sa7ar Quick Care",
    alternateName: "سحار كويك كير",
    url: "https://www.sa7arrepair.com/ar",
    telephone: "+201021024094",
    description: "مركز متخصص في صيانة الموبايلات والصوتيات والأجهزة الإلكترونية في القاهرة الجديدة.",
    address: { "@type": "PostalAddress", streetAddress: "لايف مول، الحي الأول، التجمع الخامس", addressLocality: "القاهرة الجديدة", addressRegion: "القاهرة", addressCountry: "EG" },
    geo: { "@type": "GeoCoordinates", latitude: 30.0041637, longitude: 31.4213138 },
  };

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-white text-right">
      <Script id="arabic-local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-b from-white to-gray-100 px-4 py-20 text-center md:py-28">
        <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">صيانة الموبايلات والإلكترونيات في القاهرة الجديدة</h1>
        <p className="mt-6 text-base text-gray-700 md:text-xl">موبايلات • سماعات • ساعات ذكية • مكانس ذكية • AirPods</p>
        <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-600">يقدم سحار كويك كير خدمات فحص وصيانة احترافية للآيفون والموبايلات والسماعات والأجهزة المنزلية والإلكترونيات الحديثة، مع استقبال الأجهزة من القاهرة وجميع محافظات مصر.</p>
        <p className="mt-3 text-sm text-gray-500">موقعنا في الحي الأول، لايف مول، التجمع الخامس، القاهرة الجديدة.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-blue-600">
          <Link href="/devices" className="underline hover:text-blue-800">تصفح الأجهزة</Link>
          <Link href="/repairs" className="underline hover:text-blue-800">تصفح العلامات التجارية</Link>
          <Link href="/cases" className="underline hover:text-blue-800">شاهد حالات الصيانة</Link>
        </div>
        <a href="https://wa.me/201021024094" target="_blank" rel="noopener noreferrer" className="mt-7 inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700">تواصل معنا عبر واتساب</a>
      </section>

      <section className="px-4 py-14 md:px-10 md:py-20" aria-labelledby="arabic-services">
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="arabic-services" className="text-2xl font-bold text-gray-900 md:text-3xl">خدمات الصيانة الأكثر طلبًا</h2>
          <p className="mx-auto mt-3 max-w-3xl text-gray-600">اختر نوع الجهاز أو الخدمة لمشاهدة أعمال صيانة حقيقية تمت داخل مركزنا.</p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {repairServices.map((service) => (
              <Link key={service.label} href={service.href} className="flex min-h-16 items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 font-semibold text-gray-900 transition hover:border-orange-400 hover:shadow-md"><span>{service.label}</span><span className="text-orange-500" aria-hidden="true">←</span></Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600"><Link href="/" className="font-semibold text-blue-600 hover:underline">English website</Link></p>
        </div>
      </section>

      {popularBrands.length > 0 && (
        <section className="bg-gray-50 px-4 py-14 md:px-10 md:py-20" aria-labelledby="arabic-brands">
          <div className="mx-auto max-w-6xl text-center">
            <h2 id="arabic-brands" className="text-2xl font-bold text-gray-900 md:text-3xl">أشهر العلامات التجارية التي نقوم بصيانتها</h2>
            <p className="mt-3 text-gray-600">يتم تحديث هذه القائمة تلقائيًا من حالات الصيانة المنفذة.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {popularBrands.map((brand) => <Link key={brand.id} href={`/repairs/${brand.slug}`} className="rounded-xl border border-gray-200 bg-white p-4 text-center font-semibold text-gray-900 transition hover:border-orange-400 hover:shadow-md">صيانة {brand.name}</Link>)}
            </div>
            <Link href="/repairs" className="mt-7 inline-block font-semibold text-blue-600 hover:underline">عرض جميع العلامات التجارية ←</Link>
          </div>
        </section>
      )}

      <RelatedNews heading="من داخل سحار كويك كير" description="مشاهد حقيقية من أعمال الصيانة داخل مركزنا" titles={["إصلاح مشكلة شحن سماعة JBL", "إصلاح مدخل الشحن قبل وبعد", "جولة داخل مركز سحار كويك كير"]} />

      <section className="bg-gray-50 px-4 py-20 text-center md:px-10">
        <h2 className="text-3xl font-bold text-gray-900">آراء عملائنا</h2><p className="mt-3 text-gray-600">ثقة عملائنا في جميع أنحاء مصر هي أهم ما نعتز به</p>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm"><p className="text-gray-700">“خدمة ممتازة وسريعة، وتم إصلاح سماعة JBL وعادت للعمل بصورة ممتازة.”</p><p className="mt-4 font-semibold">تقييم Google</p></div>
          <div className="rounded-xl border bg-white p-6 shadow-sm"><p className="text-gray-700">“مركز محترف وتم تشخيص وإصلاح مشكلة بطارية المكنسة الذكية.”</p><p className="mt-4 font-semibold">رأي أحد العملاء</p></div>
          <div className="rounded-xl border bg-white p-6 shadow-sm"><p className="text-gray-700">“خدمة موثوقة وأنصح بهم لصيانة AirPods والأجهزة الإلكترونية.”</p><p className="mt-4 font-semibold">تقييم Facebook</p></div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20 text-center md:px-10">
        <h2 className="text-3xl font-bold text-gray-900">أحدث حالات الصيانة</h2><p className="mt-3 text-gray-600">أعمال صيانة حقيقية من مركزنا في القاهرة الجديدة</p>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {latestCases.map((repair) => (
            <div key={repair.id} className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
              {repair.images?.[0] && <img src={repair.images[0]} alt={repair.title} className="h-56 w-full object-cover" />}
              <div className="p-5"><h3 className="text-lg font-semibold text-gray-900" dir="auto">{repair.title}</h3><p className="mt-1 text-gray-600" dir="auto">{repair.device?.brand?.name} {repair.device?.name}</p><Link href={`/cases/${repair.slug}`} className="mt-3 inline-block text-blue-600 hover:underline">عرض تفاصيل الصيانة ←</Link></div>
            </div>
          ))}
        </div>
        <Link href="/cases" className="mt-10 inline-block rounded-lg border px-6 py-3 hover:bg-gray-100">عرض جميع حالات الصيانة</Link>
      </section>

      <section className="bg-gray-100 px-4 py-20 text-center md:px-10">
        <h2 className="text-3xl font-bold text-gray-900">لماذا تختار سحار كويك كير؟</h2><p className="mt-3 text-gray-600">خبرة واحترافية في صيانة الإلكترونيات وخدمة العملاء</p>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-6"><h3 className="text-lg font-semibold">فحص احترافي</h3><p className="mt-2 text-gray-600">تشخيص دقيق للمشكلة قبل بدء الصيانة.</p></div>
          <div className="rounded-xl border bg-white p-6"><h3 className="text-lg font-semibold">صيانة متخصصة</h3><p className="mt-2 text-gray-600">خبرة في الموبايلات والسماعات والأجهزة الذكية.</p></div>
          <div className="rounded-xl border bg-white p-6"><h3 className="text-lg font-semibold">شحن لجميع المحافظات</h3><p className="mt-2 text-gray-600">يمكن للعملاء إرسال أجهزتهم من جميع أنحاء مصر.</p></div>
          <div className="rounded-xl border bg-white p-6"><h3 className="text-lg font-semibold">ثقة العملاء</h3><p className="mt-2 text-gray-600">تقييمات وتجارب إيجابية من عملائنا.</p></div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 md:px-10 md:py-20" aria-labelledby="arabic-location">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm md:p-10">
          <h2 id="arabic-location" className="text-2xl font-bold text-gray-900 md:text-3xl">تفضل بزيارة مركزنا في القاهرة الجديدة</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">الحي الأول، لايف مول، التجمع الخامس، القاهرة الجديدة. ويمكن للعملاء خارج القاهرة التواصل معنا لمعرفة تفاصيل الشحن.</p>
          <div className="mt-6 grid grid-cols-1 gap-3 text-right sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4"><h3 className="font-semibold">مواعيد العمل</h3><p className="mt-1 text-sm text-gray-600" dir="auto">{workingHours}</p><p className="mt-1 text-xs text-gray-500">يوم الإجازة: <span dir="auto">{daysOff}</span></p></div>
            <div className="rounded-xl bg-white p-4"><h3 className="font-semibold">اتصال أو واتساب</h3><a href="tel:+201021024094" className="mt-1 block text-sm text-blue-600" dir="ltr">+20 102 102 4094</a></div>
            <div className="rounded-xl bg-white p-4"><h3 className="font-semibold">الوصول إلى المركز</h3><a href="https://www.google.com/maps/dir/?api=1&destination=30.0041637,31.4213138" target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-blue-600 hover:underline">فتح خرائط Google ←</a></div>
          </div>
          {businessInfo?.notice && <p className="mt-5 text-sm font-medium text-orange-700" dir="auto">{businessInfo.notice}</p>}
        </div>
      </section>
    </main>
  );
}
