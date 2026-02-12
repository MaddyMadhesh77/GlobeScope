const SITE_URL = "https://globescope.vercel.app";

export default function Robots() {
  // getServerSideProps handles the response
}

export async function getServerSideProps({ res }) {
  const robotsTxt = `# GlobeScope Robots.txt
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(robotsTxt);
  res.end();

  return { props: {} };
}
