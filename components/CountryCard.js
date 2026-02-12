import Link from "next/link";
import { formatPopulation } from "@/lib/api";

export default function CountryCard({ country, index = 0 }) {
  return (
    <Link
      href={`/country/${country.slug}`}
      className="country-card animate-in"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.6)}s` }}
      aria-label={`View details about ${country.name}`}
    >
      <div className="country-card__flag-wrap">
        <img
          className="country-card__flag"
          src={country.flag}
          alt={country.flagAlt || `Flag of ${country.name}`}
          loading="lazy"
          width={320}
          height={160}
        />
        <span className="country-card__region-badge">{country.region}</span>
      </div>

      <div className="country-card__body">
        <h3 className="country-card__name">{country.name}</h3>
        <div className="country-card__meta">
          <span className="country-card__meta-item">
            🏛️ <strong>Capital:</strong>&nbsp;{country.capital}
          </span>
          <span className="country-card__meta-item">
            👥 <strong>Population:</strong>&nbsp;{formatPopulation(country.population)}
          </span>
          <span className="country-card__meta-item">
            🌍 <strong>Region:</strong>&nbsp;{country.region}
          </span>
        </div>
      </div>
    </Link>
  );
}
