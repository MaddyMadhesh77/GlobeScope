import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div>
          <div className="footer__brand">🌍 GlobeScope</div>
          <p className="footer__text">
            Data provided by{" "}
            <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer">
              REST Countries API
            </a>
          </p>
        </div>

        <ul className="footer__links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/region/asia">Regions</Link></li>
          <li><Link href="/compare">Compare</Link></li>
        </ul>

        <p className="footer__text">
          © {new Date().getFullYear()} GlobeScope. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
