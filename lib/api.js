const API_BASE = "https://restcountries.com/v3.1";

let cachedCountries = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllCountries() {
  const now = Date.now();
  if (cachedCountries && now - cacheTimestamp < CACHE_DURATION) {
    return cachedCountries;
  }

  const fieldList = [
    "name",
    "capital",
    "population",
    "region",
    "subregion",
    "languages",
    "currencies",
    "flags",
    "coatOfArms",
    "borders",
    "timezones",
    "area",
    "latlng",
    "maps",
    "independent",
    "unMember",
    "landlocked",
    "continents",
    "startOfWeek",
    "tld",
    // "cca3" is added automatically to every batch for merging
  ];

  const fieldList = [
    "name",
    "capital",
    "population",
    "region",
    "subregion",
    "languages",
    "currencies",
    "flags",
    "coatOfArms",
    "borders",
    "timezones",
    "area",
    "latlng",
    "maps",
    "independent",
    "unMember",
    "landlocked",
    "continents",
    "startOfWeek",
    "tld",
    "cca3",
  ];

  try {
    const fields = fieldList.join(",");
    const res = await fetch(`https://restcountries.com/v3.1/all?fields=${fields}`, {
      // cache: "no-store", // In Next.js 14+ fetch is cached by default, but here we might want to control it or rely on ISR
      // optimization: Let Next.js handle caching if using getStaticProps
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GlobeScope/1.0)",
        "Accept": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch countries: ${res.status} ${res.statusText}`);

    const data = await res.json();

  cachedCountries = data
    .map((c) => ({
      name: c.name?.common || "Unknown",
      officialName: c.name?.official || c.name?.common || "Unknown",
      slug: slugify(c.name?.common || "unknown"),
      cca3: c.cca3 || "",
      capital: c.capital?.[0] || "N/A",
      region: c.region || "Unknown",
      subregion: c.subregion || "N/A",
      population: c.population || 0,
      area: c.area || 0,
      languages: c.languages ? Object.values(c.languages) : [],
      currencies: c.currencies
        ? Object.entries(c.currencies).map(([code, v]) => ({
            code,
            name: v.name,
            symbol: v.symbol,
          }))
        : [],
      flag: c.flags?.svg || c.flags?.png || "",
      flagAlt: c.flags?.alt || `Flag of ${c.name?.common}`,
      coatOfArms: c.coatOfArms?.svg || c.coatOfArms?.png || "",
      borders: c.borders || [],
      timezones: c.timezones || [],
      latlng: c.latlng || [0, 0],
      maps: c.maps?.googleMaps || "",
      independent: c.independent ?? true,
      unMember: c.unMember ?? false,
      landlocked: c.landlocked ?? false,
      continents: c.continents || [],
      startOfWeek: c.startOfWeek || "monday",
      tld: c.tld || [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  cacheTimestamp = now;
  return cachedCountries;
}

export async function getCountryBySlug(slug) {
  const countries = await getAllCountries();
  return countries.find((c) => c.slug === slug) || null;
}

export async function getCountriesByRegion(region) {
  const countries = await getAllCountries();
  return countries.filter(
    (c) => c.region.toLowerCase() === region.toLowerCase(),
  );
}

export async function getRegions() {
  const countries = await getAllCountries();
  const regionSet = new Set(countries.map((c) => c.region));
  return [...regionSet].filter(Boolean).sort();
}

export async function getCountryByCca3(cca3) {
  const countries = await getAllCountries();
  return countries.find((c) => c.cca3 === cca3) || null;
}

export function formatPopulation(pop) {
  if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(2) + "B";
  if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(2) + "M";
  if (pop >= 1_000) return (pop / 1_000).toFixed(1) + "K";
  return pop.toString();
}

export function formatArea(area) {
  return area.toLocaleString() + " km²";
}
