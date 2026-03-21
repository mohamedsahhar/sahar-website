import { cases } from "@/data/cases"

export default function sitemap() {
  const baseUrl = "https://sa7arrepair.com"

  const caseUrls = cases.map((repair) => ({
    url: `${baseUrl}/cases/${repair.slug}`,
    lastModified: new Date(),
  }))

  const deviceUrls = cases.map((repair) => ({
    url: `${baseUrl}/devices/${repair.device.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
  }))

  const brandUrls = cases.map((repair) => ({
    url: `${baseUrl}/repairs/${repair.brand.toLowerCase()}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/devices`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/repairs`,
      lastModified: new Date(),
    },
    ...caseUrls,
    ...deviceUrls,
    ...brandUrls,
  ]
}