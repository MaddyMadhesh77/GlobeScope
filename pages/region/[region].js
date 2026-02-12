import { useState, useMemo } from "react";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import CountryCard from "@/components/CountryCard";
import { getCountriesByRegion, getRegions } from "@/lib/api";

const ITEMS_PER_PAGE = 12;
const SITE_URL = "https://globescope.vercel.app";

const REGION_DESCRIPTIONS = {
  africa:
    "Explore all countries in Africa. Discover population data, capitals, languages, and fascinating facts about African nations.",
  americas:
    "Explore all countries in the Americas. From North to South America, discover population, capitals, and key facts.",
  asia:
    "Explore all countries in Asia. Discover the most populous continent's nations with detailed facts and statistics.",
  europe:
    "Explore all countries in Europe. Discover rich histories, diverse cultures, and detailed facts about European nations.",
  oceania:
    "Explore all countries in Oceania. Discover island nations, Australia, and the Pacific region's countries.",
  antarctic:
    "Explore territories in the Antarctic region. Discover the southernmost territories and their unique characteristics.",
};

export default function RegionPage({ countries, region, regions }) {
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const list = [...countries];
    switch (sort) {
      case "population-desc":
        return list.sort((a, b) => b.population - a.population);
      case "population-asc":
        return list.sort((a, b) => a.population - b.population);
      case "area-desc":
        return list.sort((a, b) => b.area - a.area);
      case "area-asc":
        return list.sort((a, b) => a.area - b.area);
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [countries, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const displayed = sorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const displayRegion = region.charAt(0).toUpperCase() + region.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Countries in ${displayRegion}`,
    description: REGION_DESCRIPTIONS[region] || `Countries in the ${displayRegion} region.`,
    numberOfItems: countries.length,
    itemListElement: countries.slice(0, 20).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/country/${c.slug}`,
    })),
  };

  return (
    <>
      <SEOHead
        title={`Countries in ${displayRegion} — Complete Guide`}
        description={
          REGION_DESCRIPTIONS[region] ||
          `Explore all countries in ${displayRegion} with detailed facts, population data, and more.`
        }
        canonical={`${SITE_URL}/region/${region}`}
        jsonLd={jsonLd}
      />

      <div className="container" style={{ paddingTop: "2rem" }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb__sep">›</span>
          <span>Regions</span>
          <span className="breadcrumb__sep">›</span>
          <span>{displayRegion}</span>
        </nav>

        {/* Page Title */}
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Countries in {displayRegion}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          {REGION_DESCRIPTIONS[region] ||
            `Explore all ${countries.length} countries in ${displayRegion}.`}
        </p>

        {/* Region Quick Nav */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {regions.map((r) => (
            <Link
              key={r}
              href={`/region/${r.toLowerCase()}`}
              className="badge"
              style={{
                background:
                  r.toLowerCase() === region
                    ? "var(--accent-primary)"
                    : "var(--bg-card)",
                color:
                  r.toLowerCase() === region
                    ? "#fff"
                    : "var(--text-secondary)",
                padding: "0.4rem 0.9rem",
                fontSize: "0.8rem",
                border: "1px solid var(--border-color)",
              }}
            >
              {r}
            </Link>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-bar__controls">
            <select
              id="sort-select"
              className="filter-bar__select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              aria-label="Sort countries"
            >
              <option value="name">Sort by Name</option>
              <option value="population-desc">Population (High → Low)</option>
              <option value="population-asc">Population (Low → High)</option>
              <option value="area-desc">Area (Largest)</option>
              <option value="area-asc">Area (Smallest)</option>
            </select>
          </div>
          <span className="filter-bar__count">
            {countries.length} countries in {displayRegion}
          </span>
        </div>

        {/* Country Grid */}
        <div className="countries-grid">
          {displayed.map((country, i) => (
            <CountryCard key={country.slug} country={country} index={i} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination__btn ${
                  page === i + 1 ? "active" : ""
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination__btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: "2rem" }}>
          <Link href="/" className="back-link">
            ← Back to all countries
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { region } = context.params;

  try {
    const [countries, regions] = await Promise.all([
      getCountriesByRegion(region),
      getRegions(),
    ]);

    if (countries.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        countries,
        region: region.toLowerCase(),
        regions,
      },
    };
  } catch (error) {
    console.error("Failed to fetch region data:", error);
    return { notFound: true };
  }
}
