import { getAllCountries, getRegions } from "@/lib/api";

const SITE_URL = "https://globescope.vercel.app";

function generateSiteMap(countries, regions) {
  const today = new Date().toISOString().split("T")[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/compare</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${regions
    .map(
      (r) => `
  <url>
    <loc>${SITE_URL}/region/${r.toLowerCase()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
  ${countries
    .map(
      (c) => `
  <url>
    <loc>${SITE_URL}/country/${c.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("")}
</urlset>`;
}

export default function SiteMap() {
  // getServerSideProps handles the response
}

export async function getServerSideProps({ res }) {
  const [countries, regions] = await Promise.all([
    getAllCountries(),
    getRegions(),
  ]);

  const sitemap = generateSiteMap(countries, regions);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
