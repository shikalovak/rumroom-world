import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../consts';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const pillars = await getCollection('pillars');

  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about/', changefreq: 'monthly', priority: 0.7 },
  ];

  const pillarUrls = pillars.map((p) => ({
    url: `/pillars/${p.slug}/`,
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  }));

  const postUrls = posts
    .filter((p) => !p.data.draft)
    .map((p) => {
      // Map cluster (e.g., "bali/practical") to URL pattern (/bali/<slug>/)
      const country = p.data.cluster.split('/')[0];
      return {
        url: `/${country}/${p.slug.split('/').pop()}/`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: (p.data.updatedDate ?? p.data.pubDate).toISOString().split('T')[0],
      };
    });

  const allUrls = [...staticPages, ...pillarUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (entry) => `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
