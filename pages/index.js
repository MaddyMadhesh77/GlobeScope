import { useState, useMemo } from "react";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import CountryCard from "@/components/CountryCard";
import { getAllCountries, getRegions, formatPopulation } from "@/lib/api";

const ITEMS_PER_PAGE = 12;
const SITE_URL = "https://globescope.vercel.app";

const REGION_ICONS = {
  Africa: "🌍",
  Americas: "🌎",
  Asia: "🌏",
  Europe: "🏰",
  Oceania: "🏝️",
  Antarctic: "🧊",
};

export default function Home({ countries, regions }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [countries, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPopulation = countries.reduce((s, c) => s + c.population, 0);
  const totalLanguages = new Set(countries.flatMap((c) => c.languages)).size;

  const regionCounts = {};
  countries.forEach((c) => {
    regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GlobeScope",
    url: SITE_URL,
    description:
      "Explore comprehensive facts, statistics, and information about every country in the world.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SEOHead
        title={null}
        description="Explore comprehensive facts, statistics, and information about every country in the world. Discover population data, capitals, languages, currencies, and more for 250+ countries."
        canonical={SITE_URL}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__badge">🚀 250+ Countries & Territories</div>
        <h1 className="hero__title">
          Explore Every Country
          <br />
          <span className="hero__title-accent">on Earth</span>
        </h1>
        <p className="hero__subtitle">
          Discover comprehensive facts, population data, languages, currencies,
          and fascinating details about every nation in the world.
        </p>

        {/* Search */}
        <div className="search-box">
          <span className="search-box__icon">🔍</span>
          <input
            id="country-search"
            className="search-box__input"
            type="text"
            placeholder="Search countries, capitals, or regions..."
            value={search}
            onChange={handleSearch}
            aria-label="Search countries"
          />
        </div>
      </section>

      <div className="container">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-item__value">{countries.length}</div>
            <div className="stat-item__label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value">
              {formatPopulation(totalPopulation)}
            </div>
            <div className="stat-item__label">World Population</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value">{regions.length}</div>
            <div className="stat-item__label">Regions</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__value">{totalLanguages}+</div>
            <div className="stat-item__label">Languages</div>
          </div>
        </div>

        {/* Regions Quick Links */}
        <section>
          <div className="section-header">
            <h2 className="section-header__title">Explore by Region</h2>
          </div>
          <div className="regions-grid">
            {regions.map((r) => (
              <Link
                key={r}
                href={`/region/${r.toLowerCase()}`}
                className="region-card animate-in"
              >
                <span className="region-card__icon">
                  {REGION_ICONS[r] || "🌐"}
                </span>
                <div className="region-card__info">
                  <h3>{r}</h3>
                  <p>{regionCounts[r] || 0} countries</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Countries Grid */}
        <section style={{ marginTop: "3rem" }}>
          <div className="section-header">
            <h2 className="section-header__title">
              {search ? `Results for "${search}"` : "All Countries"}
            </h2>
            <span className="filter-bar__count">
              {filtered.length} countries found
            </span>
          </div>

          {displayed.length > 0 ? (
            <div className="countries-grid">
              {displayed.map((country, i) => (
                <CountryCard key={country.slug} country={country} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <div className="empty-state__title">No countries found</div>
              <p>Try adjusting your search term</p>
            </div>
          )}

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
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`pagination__btn ${
                      page === pageNum ? "active" : ""
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="pagination__btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const [countries, regions] = await Promise.all([
      getAllCountries(),
      getRegions(),
    ]);
    return {
      props: {
        countries,
        regions,
      },
    };
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return {
      props: {
        countries: [],
        regions: [],
      },
    };
  }
}
