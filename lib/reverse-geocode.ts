/**
 * Client-side reverse geocode (no API key). Uses BigDataCloud public endpoint.
 * @see https://www.bigdatacloud.net/packages/geolocation-packages/
 */
export interface ReverseGeocodeResult {
  cityLabel: string
  /** ISO country code when available */
  countryCode?: string
}

export async function reverseGeocodeClient(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client"
  )
  url.searchParams.set("latitude", String(latitude))
  url.searchParams.set("longitude", String(longitude))
  url.searchParams.set("localityLanguage", "es")

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) return null

  const data = (await res.json()) as {
    city?: string
    locality?: string
    principalSubdivision?: string
    countryName?: string
    countryCode?: string
  }

  const city =
    data.city?.trim() ||
    data.locality?.trim() ||
    data.principalSubdivision?.trim() ||
    ""

  if (!city) return null

  const label = data.countryName ? `${city} · ${data.countryName}` : city
  return {
    cityLabel: label,
    countryCode: data.countryCode,
  }
}
