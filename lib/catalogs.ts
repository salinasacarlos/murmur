import {
  ALL_INDUSTRY_LEAF_LABELS,
  INDUSTRY_SLUG_TO_LABEL,
} from "@/lib/industry-tree"

/** All leaf industry labels (align with `industries_catalog` rows that have a parent). */
export const INDUSTRIES_CATALOG = ALL_INDUSTRY_LEAF_LABELS

export const WORLDWIDE_CITY_LABEL = "Todo el mundo" as const

export const CITIES_CATALOG = [
  WORLDWIDE_CITY_LABEL,
  "Ciudad de México",
  "Guadalajara",
  "Monterrey",
  "Querétaro",
  "Puebla",
  "Tijuana",
  "Mérida",
  "León",
  "Toluca",
  "Cancún",
  "Aguascalientes",
  "San Luis Potosí",
  "Chihuahua",
  "Hermosillo",
  "Saltillo",
  "Culiacán",
  "Morelia",
  "Oaxaca",
  "Veracruz",
  "Torreón",
  "Mexicali",
  "Ciudad Juárez",
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Cúcuta",
  "Miami",
  "San Francisco",
  "New York",
  "Los Angeles",
  "Austin",
  "Seattle",
  "Boston",
  "Chicago",
  "Houston",
  "Dallas",
  "Denver",
  "Atlanta",
  "Washington DC",
  "San Diego",
  "Phoenix",
  "Lima",
  "Buenos Aires",
  "Santiago",
  "São Paulo",
  "Rio de Janeiro",
  "Montevideo",
  "Asunción",
  "Quito",
  "Guayaquil",
  "La Paz",
  "Santa Cruz",
  "San José",
  "Panamá",
  "Santo Domingo",
  "San Juan",
  "San Salvador",
  "Guatemala",
  "Tegucigalpa",
  "Managua",
  "Caracas",
  "Maracaibo",
  "La Habana",
  "Brasília",
  "Curitiba",
  "Florianópolis",
  "Porto Alegre",
  "Recife",
] as const

/** Slug for `cities_catalog.slug` / `profile_cities.city_slug` (same normalization as industries). */
export const cityLabelToSlug = industryLabelToSlug

/** Stable slug for `industries_catalog.slug` / `search_industries.industry_slug`. */
export function industryLabelToSlug(label: string): string {
  return label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function industrySlugToLabel(slug: string): string {
  const fromTree = INDUSTRY_SLUG_TO_LABEL.get(slug)
  if (fromTree) return fromTree
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
