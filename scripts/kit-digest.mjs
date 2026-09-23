// Weekly "new on Rumroom" email via Kit API v4 (free plan: RSS automation is paid-only).
// Reads https://rumroom.world/rss.xml, takes posts published in the last DAYS days,
// and creates a Kit broadcast to all subscribers.
//
// Env:
//   KIT_API_KEY   — Kit v4 API key (GitHub secret)
//   MODE          — "send" (schedule in 10 min) | "draft" (save as draft, for preview). Default: draft
//   DAYS          — look-back window in days. Default: 7
//   FORCE         — "1" to skip the duplicate check
// Node 20+, no dependencies.

const FEED = 'https://rumroom.world/rss.xml';
const API = 'https://api.kit.com/v4';
const KEY = process.env.KIT_API_KEY;
const MODE = process.env.MODE || 'draft';
const DAYS = Number(process.env.DAYS || 7);
const FORCE = process.env.FORCE === '1';

if (!KEY) throw new Error('KIT_API_KEY is not set');

const kit = async (path, init = {}) => {
  const res = await fetch(API + path, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': KEY, ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Kit ${init.method || 'GET'} ${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
};

const unescapeXml = (s = '') =>
  s.replace(/^<!\[CDATA\[|\]\]>$/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? unescapeXml(m[1].trim()) : '';
};

// ---------- 1. New posts from the feed ----------
const xml = await (await fetch(FEED, { headers: { 'Cache-Control': 'no-cache' } })).text();
// Whole UTC days: [today − DAYS, today). pubDate in the feed is a date at 00:00 UTC,
// so a post dated today goes into next week's issue — no gaps, no doubles.
const today = new Date(); today.setUTCHours(0, 0, 0, 0);
const until = today.getTime();
const since = until - DAYS * 24 * 3600 * 1000;
const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  .map(([, it]) => ({
    title: tag(it, 'title'),
    link: tag(it, 'link'),
    description: tag(it, 'description'),
    date: new Date(tag(it, 'pubDate')),
    card: tag(it, 'content:encoded'),
  }))
  .filter((p) => p.date.getTime() >= since && p.date.getTime() < until)
  .sort((a, b) => a.date - b.date);

if (!posts.length) {
  console.log(`No posts in the last ${DAYS} days — nothing to send.`);
  process.exit(0);
}
console.log(`Posts for this issue (${posts.length}):\n` + posts.map((p) => `  • ${p.title}`).join('\n'));

// ---------- 2. Don't send the same issue twice ----------
const issueKey = 'rumroom-digest:' + posts.map((p) => p.link.replace('https://rumroom.world', '')).join(',');
if (!FORCE) {
  const { broadcasts = [] } = await kit('/broadcasts?per_page=50');
  const dup = broadcasts.find((b) => (b.description || '') === issueKey && (MODE === 'draft' || b.send_at || b.status !== 'draft'));
  if (dup) {
    console.log(`Already created as broadcast #${dup.id} — skipping.`);
    process.exit(0);
  }
}

// ---------- 3. Email ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const font = "font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;";
const one = posts.length === 1;
const subject = one
  ? `New guide: ${posts[0].title}`
  : `New on Rumroom: ${posts[posts.length - 1].title} + ${posts.length - 1} more`;
const preview = one ? posts[0].description : posts.map((p) => p.title).join(' · ');
const intro = one
  ? 'A new guide just went up on the blog — here it is, while it’s fresh.'
  : `${posts.length} new guides went up on the blog this week. Here they are in one place — pick whichever fits your next trip.`;

const content = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F5F5;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
  <tr><td style="padding:8px 4px 24px 4px;${font}">
    <a href="https://rumroom.world/" style="text-decoration:none;"><img src="https://rumroom.world/logo.png" alt="Rumroom World" height="40" style="display:block;height:40px;width:auto;border:0;"></a>
  </td></tr>
  <tr><td style="padding:0 4px 28px 4px;${font}">
    <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;color:#E73C3C;">${one ? 'New on the blog' : 'This week on Rumroom'}</p>
    <h1 style="margin:0 0 12px 0;font-size:28px;line-height:34px;font-weight:800;color:#171717;">Hi {{ subscriber.first_name | default: "there" }} 👋</h1>
    <p style="margin:0;font-size:16px;line-height:25px;color:#4a4a4a;">${intro}</p>
  </td></tr>
  <tr><td>
    ${posts.map((p) => p.card || `<p><a href="${p.link}">${esc(p.title)}</a></p>`).join('\n')}
  </td></tr>
  <tr><td style="padding:4px 4px 8px 4px;${font}">
    <p style="margin:0 0 16px 0;font-size:16px;line-height:25px;color:#4a4a4a;">Planning something and want me to cover it? Just hit reply — I read every email.</p>
    <p style="margin:0;font-size:16px;line-height:25px;color:#171717;">Slowly yours,<br><strong>Kseniia</strong></p>
    <p style="margin:20px 0 0 0;font-size:13px;line-height:20px;color:#8a8a8a;">More guides: <a href="https://rumroom.world/pillars/bali/" style="color:#8a8a8a;">Bali</a> · <a href="https://rumroom.world/pillars/italy/" style="color:#8a8a8a;">Italy</a> · <a href="https://rumroom.world/pillars/france/" style="color:#8a8a8a;">France</a></p>
  </td></tr>
</table>
</td></tr>
</table>`.trim();

// ---------- 4. Template: the plainest one, so the design above isn't boxed in ----------
let email_template_id;
try {
  const { email_templates = [] } = await kit('/email_templates');
  const pick =
    email_templates.find((t) => /text only/i.test(t.name)) ||
    email_templates.find((t) => /classic/i.test(t.name));
  email_template_id = pick?.id;
  if (pick) console.log(`Template: ${pick.name} (#${pick.id})`);
} catch (e) {
  console.log('Could not list templates, using account default:', e.message);
}

const sendAt = MODE === 'send' ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null;
const { broadcast } = await kit('/broadcasts', {
  method: 'POST',
  body: JSON.stringify({
    subject,
    preview_text: preview.slice(0, 140),
    description: issueKey,
    content,
    public: false,
    published_at: new Date().toISOString(),
    send_at: sendAt,
    ...(email_template_id ? { email_template_id } : {}),
    thumbnail_url: null,
    thumbnail_alt: null,
  }),
});

console.log(
  `${MODE === 'send' ? 'Scheduled for ' + sendAt : 'Saved as draft'}: broadcast #${broadcast.id} — "${subject}"`,
);
