# Supabase Scraper Integration + High School Opportunity Sites

**Date**: 2026-04-01
**Status**: Approved

## Goal

Save scraped and Gemini-classified opportunities to Supabase (PostgreSQL via Prisma), add high school opportunity websites, and serve the main page from the database.

## Architecture

```
POST /api/scrape (trigger)
  → Cheerio scrapes all sites from lib/sites.ts
  → Gemini classifies: type, subjects, minAge, maxAge
  → Upsert to Supabase via Prisma (deduplicate by originalUrl)
  → Update ScrapedSource.lastScrapedAt

GET /api/opportunities (read)
  → Query Opportunity table with filters (type, subject, search)
  → Return paginated results

Main page
  → Fetches GET /api/opportunities
  → Displays cards with filters
```

## Prisma Schema Mapping

No schema changes needed. The existing schema already supports everything.

### ScrapedSource

Each site in `lib/sites.ts` maps to a `ScrapedSource` record:
- `name` ← SiteConfig.name
- `url` ← SiteConfig.url (unique)
- `lastScrapedAt` ← set after successful scrape

### Opportunity

Each scraped + classified article maps to an `Opportunity` record:
- `sourceId` ← looked up from ScrapedSource by URL
- `title` ← ScrapedItem.title
- `description` ← ScrapedItem.description (empty string if not available)
- `originalUrl` ← ScrapedItem.originalUrl (unique, used for dedup)
- `imageUrl` ← ScrapedItem.imageUrl (nullable)
- `originalLang` ← SiteConfig.lang (default "mn")
- `type` ← Gemini classification (OpportunityType enum)
- `subjects` ← Gemini classification (Subject[] enum array)
- `minAge` ← Gemini extraction (nullable)
- `maxAge` ← Gemini extraction (nullable)
- `status` ← default ACTIVE
- `scrapedAt` ← current timestamp
- `tags` ← empty array (future use)
- `deadline`, `location`, `isRemote`, `organization` ← null (not extractable from titles)

### Upsert Strategy

Use Prisma `upsert` with `originalUrl` as the unique key:
- **Create**: insert new opportunity with all classified fields
- **Update**: update title, description, imageUrl, type, subjects, minAge, maxAge, scrapedAt

## Gemini Classification (Enhanced)

Single prompt per batch returns JSON array:

```json
[
  {
    "index": 0,
    "type": "COMPETITION",
    "subjects": ["MATHEMATICS", "SCIENCE"],
    "minAge": 14,
    "maxAge": 18
  }
]
```

Valid `type` values: JOB, SCHOLARSHIP, GRANT, INTERNSHIP, COMPETITION, OTHER
Valid `subjects` values: STEM, SCIENCE, TECHNOLOGY, ENGINEERING, MATHEMATICS, ARTS, HUMANITIES, SOCIAL_SCIENCE, BUSINESS, LAW, MEDICINE, COMPUTER_SCIENCE, ENVIRONMENT, DESIGN, EDUCATION, OTHER

The prompt instructs Gemini to:
- Filter articles matching opportunity categories
- Classify type from the OpportunityType enum
- Guess subjects from the Subject enum (array, can be multiple)
- Estimate age range if determinable (null otherwise)

## New Sites to Add

### Mongolian Sites
- **Olimplus** (olimplus.mn) — Mongolian olympiad/competition platform
- **Ministry of Education** (meds.gov.mn) — government education announcements

### International Sites
- Research international STEM competition aggregator pages with working selectors

Each site requires HTML inspection to find accurate CSS selectors before adding.

## API Routes

### POST /api/scrape

- No auth required (hackathon scope)
- Scrapes all configured sites
- For each site: find or create ScrapedSource record
- Classifies with Gemini
- Upserts each opportunity to DB
- Returns: `{ scraped: number, saved: number, errors: string[] }`

### GET /api/opportunities

- Query params:
  - `type` — filter by OpportunityType (e.g., SCHOLARSHIP)
  - `subject` — filter by Subject enum value
  - `search` — full-text search on title
  - `status` — filter by status (default: ACTIVE)
- Returns: `{ total: number, opportunities: Opportunity[] }`
- Ordered by scrapedAt DESC

## Environment Variables

Add to `.env.local`:
```
DATABASE_URL="postgresql://..." (copy from .env)
DIRECT_URL="postgresql://..." (copy from .env)
```

## File Changes

| File | Action |
|---|---|
| `.env.local` | Add DATABASE_URL and DIRECT_URL |
| `lib/sites.ts` | Add new site configs (olimplus.mn, meds.gov.mn) |
| `lib/gemini-filter.ts` | Enhanced prompt returning type + subjects + age |
| `app/api/scrape/route.ts` | New — trigger scrape → classify → save to DB |
| `app/api/opportunities/route.ts` | New — read from DB with filters |
| `app/page.tsx` | Update to read from /api/opportunities, add filter UI |

No changes to: `prisma/schema.prisma`, `lib/prisma.ts`, `lib/scraper.ts`

## Out of Scope

- Authentication/authorization for scrape endpoint
- Translation model population
- SavedOpportunity (bookmarking) UI
- Cron/scheduled scraping
- Pagination (keep simple for hackathon)
