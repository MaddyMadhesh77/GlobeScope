import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { getAllCountries, formatPopulation, formatArea } from "@/lib/api";

const SITE_URL = "https://globescope.vercel.app";

export default function ComparePage({ countries }) {
  const [selected, setSelected] = useState(["", "", ""]);

  const handleSelect = (index, slug) => {
    const next = [...selected];
    next[index] = slug;
    setSelected(next);
  };

  const selectedCountries = useMemo(() => {
    return selected
      .map((slug) => countries.find((c) => c.slug === slug))
      .filter(Boolean);
  }, [selected, countries]);

  const compareFields = [
    { label: "Flag", key: "flag", type: "image" },
    { label: "Capital", key: "capital" },
    { label: "Region", key: "region" },
    { label: "Subregion", key: "subregion" },
    { label: "Population", key: "population", format: (v) => v.toLocaleString() },
    { label: "Area", key: "area", format: (v) => formatArea(v) },
    {
      label: "Languages",
      key: "languages",
      format: (v) => (v.length > 0 ? v.join(", ") : "N/A"),
    },
    {
      label: "Currencies",
      key: "currencies",
      format: (v) =>
        v.length > 0 ? v.map((c) => `${c.name} (${c.symbol})`).join(", ") : "N/A",
    },
    {
      label: "Timezones",
      key: "timezones",
      format: (v) => v.join(", "),
    },
    { label: "Landlocked", key: "landlocked", format: (v) => (v ? "Yes" : "No") },
    { label: "UN Member", key: "unMember", format: (v) => (v ? "Yes" : "No") },
    { label: "Independent", key: "independent", format: (v) => (v ? "Yes" : "No") },
  ];

  // Population bar chart data
  const maxPop = Math.max(...selectedCountries.map((c) => c.population), 1);
  const maxArea = Math.max(...selectedCountries.map((c) => c.area), 1);
  const barColors = ["#3b82f6", "#8b5cf6", "#10b981"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Countries — GlobeScope",
    description: "Compare statistics, population, area, languages, and more between countries side by side.",
    url: `${SITE_URL}/compare`,
  };

  return (
    <>
      <SEOHead
        title="Compare Countries Side by Side"
        description="Compare statistics, population, area, languages, currencies, and more between countries side by side. Interactive country comparison tool."
        canonical={`${SITE_URL}/compare`}
        jsonLd={jsonLd}
      />

      <div className="container compare-page">
        <h1>Compare Countries</h1>
        <p className="compare-page__subtitle">
          Select up to 3 countries to compare their statistics side by side.
        </p>

        {/* Selectors */}
        <div className="compare-selectors">
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              id={`compare-select-${i}`}
              value={selected[i]}
              onChange={(e) => handleSelect(i, e.target.value)}
              aria-label={`Select country ${i + 1}`}
            >
              <option value="">
                {i === 0
                  ? "Select first country..."
                  : i === 1
                  ? "Select second country..."
                  : "Select third country (optional)..."}
              </option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Comparison Table */}
        {selectedCountries.length >= 2 && (
          <>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    {selectedCountries.map((c) => (
                      <th key={c.slug}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field) => (
                    <tr key={field.key}>
                      <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                        {field.label}
                      </td>
                      {selectedCountries.map((c) => (
                        <td key={c.slug}>
                          {field.type === "image" ? (
                            <img
                              className="compare-table__flag"
                              src={c[field.key]}
                              alt={`Flag of ${c.name}`}
                              width={48}
                              height={32}
                            />
                          ) : field.format ? (
                            field.format(c[field.key])
                          ) : (
                            c[field.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Population Chart */}
            <div className="compare-chart-wrap">
              <h3>📊 Population Comparison</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {selectedCountries.map((c, i) => (
                  <div
                    key={c.slug}
                    style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >
                    <span
                      style={{
                        minWidth: "120px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {c.name}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        height: "32px",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(
                            (c.population / maxPop) * 100,
                            2
                          )}%`,
                          height: "100%",
                          background: barColors[i],
                          borderRadius: "8px",
                          transition: "width 0.6s ease",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatPopulation(c.population)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Area Chart */}
            <div className="compare-chart-wrap">
              <h3>📐 Area Comparison</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {selectedCountries.map((c, i) => (
                  <div
                    key={c.slug}
                    style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >
                    <span
                      style={{
                        minWidth: "120px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {c.name}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        height: "32px",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(
                            (c.area / maxArea) * 100,
                            2
                          )}%`,
                          height: "100%",
                          background: barColors[i],
                          borderRadius: "8px",
                          transition: "width 0.6s ease",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatArea(c.area)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedCountries.length < 2 && (
          <div className="empty-state">
            <div className="empty-state__icon">📊</div>
            <div className="empty-state__title">
              Select at least 2 countries to compare
            </div>
            <p>Use the dropdowns above to choose countries</p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const countries = await getAllCountries();
    return {
      props: {
        countries: countries.map((c) => ({
          name: c.name,
          slug: c.slug,
          flag: c.flag,
          capital: c.capital,
          region: c.region,
          subregion: c.subregion,
          population: c.population,
          area: c.area,
          languages: c.languages,
          currencies: c.currencies,
          timezones: c.timezones,
          landlocked: c.landlocked,
          unMember: c.unMember,
          independent: c.independent,
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return { props: { countries: [] } };
  }
}
