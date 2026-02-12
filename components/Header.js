import Link from "next/link";
import { useState } from "react";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <Link href="/" className="header__logo" aria-label="GlobeScope Home">
          <span className="header__logo-icon">🌍</span>
          <span>GlobeScope</span>
        </Link>

        <button
          className="header__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav>
          <ul className={`header__nav ${menuOpen ? "open" : ""}`}>
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-dropdown">
              <a href="#" onClick={(e) => e.preventDefault()}>Regions ▾</a>
              <div className="nav-dropdown__menu">
                {REGIONS.map((r) => (
                  <Link
                    key={r}
                    href={`/region/${r.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {r}
                  </Link>
                ))}
              </div>
            </li>
            <li>
              <Link href="/compare" onClick={() => setMenuOpen(false)}>Compare</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
