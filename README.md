# Rumroom World

A travel blog for slow travelers and digital nomads, built with Astro 4, Tailwind CSS, and Markdown content collections.

**Site:** https://rumroom.world  
**GitHub:** https://github.com/shikalovak/rumroom-world  
**Author:** Kseniia

## Stack

- **Framework:** Astro 4.16
- **Styling:** Tailwind CSS
- **Content:** Markdown with Astro Collections
- **Typography:** Fraunces (headers) + Inter (body) from Google Fonts
- **Hosting:** Vercel (static)
- **Integrations:** Sitemap, RSS feed, TypeScript

## Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── BaseHead.astro
│   ├── Header.astro
│   ├── Footer.astro
│   ├── PostCard.astro
│   ├── AuthorBio.astro
│   ├── AffiliateDisclosure.astro
│   ├── AffiliateBox.astro
│   ├── EmailMagnet.astro
│   ├── RelatedPosts.astro
│   ├── TableOfContents.astro
│   └── FAQ.astro
├── layouts/             # Page layouts
│   ├── BaseLayout.astro
│   ├── PostLayout.astro
│   └── PillarLayout.astro
├── pages/               # Route definitions
│   ├── index.astro          (home)
│   ├── about.astro          (about page)
│   ├── [...slug].astro      (dynamic post routes)
│   ├── pillars/[slug].astro (pillar pages)
│   ├── rss.xml.js           (RSS feed)
│   └── 404.astro            (error page)
├── content/
│   ├── posts/
│   │   └── bali/            (10 articles)
│   └── pillars/
│       └── bali.md          (pillar overview)
├── data/
│   └── affiliates.json      (affiliate links & metadata)
├── styles/
│   └── global.css           (Tailwind + custom utilities)
└── consts.ts                (site configuration)

public/
├── robots.txt
└── favicon.svg

tailwind.config.mjs
astro.config.mjs
tsconfig.json
package.json
```

## Color Palette

- **Primary:** #2D2A26 (dark brown)
- **Secondary:** #F5EFE6 (warm off-white)
- **Accent:** #C45F2E (terracotta)
- **Soft:** #A4B5A0 (muted green)

## Content Architecture

### Collections Schema

**Posts** (`src/content/posts/`)
- Frontmatter: title, description, pubDate, cluster, primaryKeyword, secondaryKeywords, heroImage, author, readingTime, tags, affiliates, draft
- URL pattern: `/{country}/{slug}/` (e.g., `/bali/visa-guide/`)
- Clusters: `bali/practical`, `bali/food`, `bali/digital-nomad`, `bali/getting-started`, etc.

**Pillars** (`src/content/pillars/`)
- Frontmatter: title, description, emoji, order
- Generates pillar index pages with grouped articles

### Affiliate System

Affiliates defined in `src/data/affiliates.json`. Use `<AffiliateBox />` component with slug:

```astro
<AffiliateBox slug="safetywing" />
```

Current affiliates: SafetyWing, Airalo, Wise, iVisa, Discover Cars, Klook, Booking.com

## Development

### Setup

```bash
npm install
```

### Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Content Workflow

### Adding a New Article

1. Create `.md` file in `src/content/posts/{country}/`
2. Include required frontmatter:
   ```yaml
   ---
   title: "Article Title"
   description: "SEO meta description"
   pubDate: 2026-05-01
   updatedDate: 2026-05-01
   cluster: "bali/sub-topic"
   primaryKeyword: "main keyword"
   secondaryKeywords: ["keyword1", "keyword2"]
   heroImage: "/images/path.jpg"
   author: "kseniia"
   readingTime: 12
   tags: ["bali", "guide"]
   affiliates: ["safetywing", "airalo"]
   ---
   ```
3. Write content in Markdown
4. Use components: `<AffiliateBox />`, `<FAQ />`, `<EmailMagnet />`
5. Build and preview: `npm run build && npm run preview`

### Adding a New Pillar

1. Create `src/content/pillars/{slug}.md`
2. Include frontmatter:
   ```yaml
   ---
   title: "Pillar Title"
   description: "Description"
   emoji: "🌴"
   order: 1
   ---
   ```
3. Update `PILLARS` in `src/consts.ts`

## Frontmatter Normalization Applied

When importing the POC articles (10 Bali guides), the following changes were applied:
- `date:` → `pubDate:`
- `category:` → `cluster:`
- `keywords:` → `secondaryKeywords:`
- `image:` → `heroImage:`
- Added `updatedDate: 2026-05-01` to all articles
- Standardized `author: kseniia` (lowercase)

## Deploy to Vercel

```bash
git push origin main
```

Vercel will automatically build and deploy on push. Configure environment variables in Vercel dashboard if needed.

## SEO Features

- **Sitemap:** Auto-generated at `/sitemap-index.xml`
- **RSS Feed:** Available at `/rss.xml`
- **Meta Tags:** Title, description, canonical, OG, Twitter Card
- **JSON-LD:** Article schema on posts, FAQPage schema on FAQ sections
- **robots.txt:** Allows all, includes sitemap

## Future Pillars

- Spain 🇪🇸
- France 🇫🇷
- Portugal 🇵🇹
- Hungary 🇭🇺

## License

All content © 2026 Kseniia. Rumroom World reserves all rights.
