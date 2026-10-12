const COMBINING_MARKS_REGEX = /\p{M}+/gu
const NON_ALPHANUMERIC_REGEX = /[^\p{L}\p{N}]+/gu

export function normalizeEntityName(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ")
}

export function createSlug(value: unknown) {
  return normalizeEntityName(value)
    .normalize("NFKD")
    .replace(COMBINING_MARKS_REGEX, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(NON_ALPHANUMERIC_REGEX, "-")
    .replace(/^-+|-+$/g, "")
}

export function normalizeDeviceName(deviceName: unknown, brandName: unknown) {
  const normalizedDevice = normalizeEntityName(deviceName)
  const normalizedBrand = normalizeEntityName(brandName)

  if (!normalizedBrand) return normalizedDevice

  const prefix = `${normalizedBrand.toLowerCase()} `

  return normalizedDevice.toLowerCase().startsWith(prefix)
    ? normalizedDevice.slice(prefix.length).trim()
    : normalizedDevice
}

export function getDeviceDisplayName(brandName: unknown, deviceName: unknown) {
  const brand = normalizeEntityName(brandName)
  const device = normalizeEntityName(deviceName)

  if (!brand) return device
  if (!device) return brand

  return device.toLowerCase().startsWith(`${brand.toLowerCase()} `)
    ? device
    : `${brand} ${device}`
}

export async function createUniqueSlug(
  value: unknown,
  isTaken: (slug: string) => Promise<boolean>
) {
  const baseSlug = createSlug(value)

  if (!baseSlug) {
    throw new Error("A valid name is required to create a URL")
  }

  if (!(await isTaken(baseSlug))) return baseSlug

  for (let suffix = 2; suffix <= 1000; suffix += 1) {
    const candidate = `${baseSlug}-${suffix}`
    if (!(await isTaken(candidate))) return candidate
  }

  throw new Error("Unable to create a unique URL")
}
