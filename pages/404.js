import Link from "next/link";
import SEOHead from "@/components/SEOHead";

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you are looking for does not exist."
        noindex={true}
      />
      <div className="container">
        <div className="empty-state" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
          <div className="empty-state__icon">🌍</div>
          <div className="empty-state__title" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            404
          </div>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Oops! This country hasn&apos;t been discovered yet.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--accent-gradient)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "100px",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            ← Explore All Countries
          </Link>
        </div>
      </div>
    </>
  );
}
