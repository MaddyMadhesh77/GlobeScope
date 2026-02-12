import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import {
  getCountryBySlug,
  getAllCountries,
  getCountryByCca3,
  formatPopulation,
  formatArea,
} from "@/lib/api";

const SITE_URL = "https://globescope.vercel.app";

export default function CountryPage({ country, neighbors }) {
  if (!country) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: "6rem" }}>
          <div className="empty-state__icon">😕</div>
          <div className="empty-state__title">Country not found</div>
          <p>
            <Link href="/">← Back to all countries</Link>
          </p>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: country.name,
    description: `${country.name} is a country located in ${country.region}${country.subregion !== "N/A" ? `, ${country.subregion}` : ""}. Capital: ${country.capital}. Population: ${formatPopulation(country.population)}.`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: country.latlng[0],
      longitude: country.latlng[1],
    },
    url: `${SITE_URL}/country/${country.slug}`,
    image: country.flag,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Population",
        value: country.population,
      },
      {
        "@type": "PropertyValue",
        name: "Area",
        value: `${country.area} km²`,
      },
      {
        "@type": "PropertyValue",
        name: "Capital",
        value: country.capital,
      },
    ],
  };

  const description = `Discover facts about ${country.name}: capital ${country.capital}, population ${formatPopulation(country.population)}, located in ${country.region}. Languages, currencies, geography, and more.`;

  return (
    <>
      <SEOHead
        title={`${country.name} — Facts, Capital, Population`}
        description={description}
        ogImage={country.flag}
        ogType="article"
        canonical={`${SITE_URL}/country/${country.slug}`}
        jsonLd={jsonLd}
      />

      <div className="container country-detail">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb__sep">›</span>
          <Link href={`/region/${country.region.toLowerCase()}`}>
            {country.region}
          </Link>
          <span className="breadcrumb__sep">›</span>
          <span>{country.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="country-hero">
          <img
            className="country-hero__flag"
            src={country.flag}
            alt={country.flagAlt}
            width={600}
            height={400}
          />

          <div className="country-hero__info">
            <h1>{country.name}</h1>
            <p className="country-hero__official">{country.officialName}</p>

            <div className="country-hero__badges">
              <span className="badge badge--region">📍 {country.region}</span>
              {country.subregion !== "N/A" && (
                <span className="badge badge--subregion">
                  🗺️ {country.subregion}
                </span>
              )}
              {country.independent && (
                <span className="badge badge--independent">
                  ✅ Independent
                </span>
              )}
              {country.unMember && (
                <span className="badge badge--un">🇺🇳 UN Member</span>
              )}
            </div>

            <div className="country-hero__quick-stats">
              <div className="quick-stat">
                <div className="quick-stat__value">
                  {formatPopulation(country.population)}
                </div>
                <div className="quick-stat__label">Population</div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat__value">
                  {formatArea(country.area)}
                </div>
                <div className="quick-stat__label">Area</div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat__value">{country.capital}</div>
                <div className="quick-stat__label">Capital</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="info-sections">
          {/* Geography */}
          <div className="info-card">
            <div className="info-card__title">
              <span className="info-card__title-icon">🗺️</span>
              Geography
            </div>
            <div className="info-row">
              <span className="info-row__label">Region</span>
              <span className="info-row__value">{country.region}</span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Subregion</span>
              <span className="info-row__value">{country.subregion}</span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Area</span>
              <span className="info-row__value">{formatArea(country.area)}</span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Coordinates</span>
              <span className="info-row__value">
                {country.latlng[0].toFixed(2)}°,{" "}
                {country.latlng[1].toFixed(2)}°
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Landlocked</span>
              <span className="info-row__value">
                {country.landlocked ? "Yes" : "No"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Continents</span>
              <span className="info-row__value">
                {country.continents.join(", ")}
              </span>
            </div>
            {country.maps && (
              <div style={{ marginTop: "0.75rem" }}>
                <a
                  href={country.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.85rem" }}
                >
                  📍 View on Google Maps →
                </a>
              </div>
            )}
          </div>

          {/* Demographics */}
          <div className="info-card">
            <div className="info-card__title">
              <span className="info-card__title-icon">👥</span>
              Demographics
            </div>
            <div className="info-row">
              <span className="info-row__label">Population</span>
              <span className="info-row__value">
                {country.population.toLocaleString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Languages</span>
              <span className="info-row__value">
                {country.languages.length > 0
                  ? country.languages.join(", ")
                  : "N/A"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Timezones</span>
              <span className="info-row__value">
                {country.timezones.join(", ")}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Start of Week</span>
              <span className="info-row__value" style={{ textTransform: "capitalize" }}>
                {country.startOfWeek}
              </span>
            </div>
          </div>

          {/* Economy */}
          <div className="info-card">
            <div className="info-card__title">
              <span className="info-card__title-icon">💰</span>
              Economy
            </div>
            {country.currencies.length > 0 ? (
              country.currencies.map((cur) => (
                <div className="info-row" key={cur.code}>
                  <span className="info-row__label">{cur.code}</span>
                  <span className="info-row__value">
                    {cur.name} ({cur.symbol})
                  </span>
                </div>
              ))
            ) : (
              <div className="info-row">
                <span className="info-row__label">Currency</span>
                <span className="info-row__value">N/A</span>
              </div>
            )}
          </div>

          {/* General Info */}
          <div className="info-card">
            <div className="info-card__title">
              <span className="info-card__title-icon">ℹ️</span>
              General
            </div>
            <div className="info-row">
              <span className="info-row__label">Official Name</span>
              <span className="info-row__value">{country.officialName}</span>
            </div>
            <div className="info-row">
              <span className="info-row__label">ISO Code</span>
              <span className="info-row__value">{country.cca3}</span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Top-Level Domain</span>
              <span className="info-row__value">
                {country.tld.length > 0 ? country.tld.join(", ") : "N/A"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">Independent</span>
              <span className="info-row__value">
                {country.independent ? "Yes" : "No"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row__label">UN Member</span>
              <span className="info-row__value">
                {country.unMember ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Neighboring Countries */}
        {neighbors.length > 0 && (
          <section className="neighbors-section">
            <div className="section-header">
              <h2 className="section-header__title">
                🤝 Neighboring Countries
              </h2>
            </div>
            <div className="neighbors-grid">
              {neighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/country/${n.slug}`}
                  className="neighbor-chip"
                >
                  <img
                    className="neighbor-chip__flag"
                    src={n.flag}
                    alt={`Flag of ${n.name}`}
                    width={24}
                    height={16}
                    loading="lazy"
                  />
                  {n.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <Link href="/" className="back-link">
          ← Back to all countries
        </Link>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const country = await getCountryBySlug(slug);

    if (!country) {
      return { notFound: true };
    }

    // Fetch neighboring countries
    const neighborPromises = country.borders.map((code) =>
      getCountryByCca3(code)
    );
    const neighborResults = await Promise.all(neighborPromises);
    const neighbors = neighborResults
      .filter(Boolean)
      .map((n) => ({
        name: n.name,
        slug: n.slug,
        flag: n.flag,
      }));

    return {
      props: {
        country,
        neighbors,
      },
    };
  } catch (error) {
    console.error("Failed to fetch country:", error);
    return { notFound: true };
  }
}
