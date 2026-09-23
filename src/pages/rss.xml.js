import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

// The feed also powers the Kit "new posts" email (Automations → RSS).
// Kit puts <content:encoded> into {{ post.content }}, so every item carries
// a ready-made, email-safe card: cover photo, country, title, blurb, button.
// Email clients ignore <style> and flexbox, so everything is tables + inline CSS.

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const COUNTRY_LABEL = {
  bali: 'Bali',
  italy: 'Italy',
  france: 'France',
  spain: 'Spain',
  portugal: 'Portugal',
  hungary: 'Hungary',
};

// Unsplash URLs come with w=1500 — too heavy for email. Ask for 1200px.
const emailImage = (url) =>
  url && url.includes('images.unsplash.com') ? url.replace(/([?&])w=\d+/, '$1w=1200') : url;

function emailCard(post, link) {
  const country = post.data.cluster.split('/')[0];
  const label = COUNTRY_LABEL[country] || country.charAt(0).toUpperCase() + country.slice(1);
  const meta = [label, post.data.readingTime ? `${post.data.readingTime} min read` : null]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ');
  const img = emailImage(post.data.heroImage);
  const font = "font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;";

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin:0 0 32px 0;background:#ffffff;border:1px solid #ececec;border-radius:20px;">
  ${img ? `<tr><td style="padding:0;">
    <a href="${link}" style="text-decoration:none;"><img src="${esc(img)}" alt="${esc(post.data.heroImageAlt || post.data.title)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:20px 20px 0 0;"></a>
  </td></tr>` : ''}
  <tr><td style="padding:28px 28px 32px 28px;${font}">
    <p style="margin:0 0 10px 0;font-size:12px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;color:#E73C3C;">${meta}</p>
    <h2 style="margin:0 0 12px 0;font-size:24px;line-height:30px;font-weight:800;color:#171717;">
      <a href="${link}" style="color:#171717;text-decoration:none;">${esc(post.data.title)}</a>
    </h2>
    <p style="margin:0 0 24px 0;font-size:16px;line-height:25px;color:#4a4a4a;">${esc(post.data.description)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-radius:30px;background:#E73C3C;">
        <a href="${link}" style="display:inline-block;padding:14px 30px;${font}font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:30px;">Read the guide &rarr;</a>
      </td>
    </tr></table>
  </td></tr>
</table>`.trim();
}

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site || SITE_URL,
    items: posts
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map((post) => {
        // Same URL pattern as src/pages/[...slug].astro and sitemap.xml.ts: /<country>/<slug>/
        const country = post.data.cluster.split('/')[0];
        const link = `${SITE_URL}/${country}/${post.slug}/`;
        return {
          title: post.data.title,
          pubDate: post.data.pubDate,
          description: post.data.description,
          link,
          categories: [country],
          content: emailCard(post, link),
        };
      }),
  });
}
