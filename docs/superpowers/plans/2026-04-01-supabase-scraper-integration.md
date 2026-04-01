# Supabase Scraper Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save scraped opportunities to Supabase via Prisma, add new high school opportunity sites, and serve the main page from the database.

**Architecture:** POST /api/scrape triggers Cheerio scraping + Gemini classification → upserts to Supabase. GET /api/opportunities reads from DB with filters. Main page reads from /api/opportunities.

**Tech Stack:** Next.js 16, Prisma 7 with @prisma/adapter-pg, Supabase PostgreSQL, Cheerio, Google Generative AI SDK

---

### Task 1: Set up environment and generate Prisma client

**Files:**
- Modify: `.env.local`
- Verify: `prisma/schema.prisma`, `lib/prisma.ts`

- [ ] **Step 1: Copy database URLs to .env.local**

Add DATABASE_URL and DIRECT_URL from `.env` to `.env.local`:

```
DATABASE_URL="postgresql://postgres.zugrlnprdpskwgnudokm:IID4iHtmGgM7gZZz@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.zugrlnprdpskwgnudokm:IID4iHtmGgM7gZZz@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
GEMINI_API_KEY=<existing key>
```

- [ ] **Step 2: Generate Prisma client and push schema**

Run: `npx prisma generate && npx prisma db push`
Expected: Prisma client generated, tables created in Supabase

- [ ] **Step 3: Verify connection**

Run: `npx prisma studio`
Expected: Opens browser showing empty tables (ScrapedSource, Opportunity, etc.)

- [ ] **Step 4: Verify build compiles**

Run: `npm run build`
Expected: No TypeScript errors related to PrismaClient import

- [ ] **Step 5: Commit**

```bash
git add .env.local
git commit -m "chore: add Supabase database URLs to env"
```

---

### Task 2: Enhance Gemini classifier to extract subjects and age range

**Files:**
- Modify: `lib/gemini-filter.ts`

- [ ] **Step 1: Update ClassifiedItem interface**

Replace the full content of `lib/gemini-filter.ts`:

```ts
import { GoogleGenerativeAI } from '@google/generative-ai';

import { ScrapedItem } from '@/lib/scraper';

export type OpportunityType =
  | 'JOB'
  | 'SCHOLARSHIP'
  | 'GRANT'
  | 'INTERNSHIP'
  | 'COMPETITION'
  | 'OTHER';

export type Subject =
  | 'STEM'
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'ENGINEERING'
  | 'MATHEMATICS'
  | 'ARTS'
  | 'HUMANITIES'
  | 'SOCIAL_SCIENCE'
  | 'BUSINESS'
  | 'LAW'
  | 'MEDICINE'
  | 'COMPUTER_SCIENCE'
  | 'ENVIRONMENT'
  | 'DESIGN'
  | 'EDUCATION'
  | 'OTHER';

export interface ClassifiedItem extends ScrapedItem {
  type: OpportunityType;
  subjects: Subject[];
  minAge: number | null;
  maxAge: number | null;
}

const VALID_TYPES = new Set<string>([
  'JOB', 'SCHOLARSHIP', 'GRANT', 'INTERNSHIP', 'COMPETITION', 'OTHER',
]);

const VALID_SUBJECTS = new Set<string>([
  'STEM', 'SCIENCE', 'TECHNOLOGY', 'ENGINEERING', 'MATHEMATICS',
  'ARTS', 'HUMANITIES', 'SOCIAL_SCIENCE', 'BUSINESS', 'LAW',
  'MEDICINE', 'COMPUTER_SCIENCE', 'ENVIRONMENT', 'DESIGN', 'EDUCATION', 'OTHER',
]);

export const classifyWithGemini = async (
  items: ScrapedItem[],
): Promise<ClassifiedItem[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return items.map((item) => ({
      ...item,
      type: 'OTHER' as OpportunityType,
      subjects: [] as Subject[],
      minAge: null,
      maxAge: null,
    }));
  }

  if (items.length === 0) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const articleList = items
    .map((item, i) => `[${i}] ${item.title}`)
    .join('\n');

  const prompt = `You are an opportunity classifier for high school and university students. Given article titles, do THREE things:

1. Filter: Keep only articles about scholarships, jobs, grants, internships, competitions, programs, or similar opportunities
2. Classify type: JOB, SCHOLARSHIP, GRANT, INTERNSHIP, COMPETITION, or OTHER
3. Classify subjects from: STEM, SCIENCE, TECHNOLOGY, ENGINEERING, MATHEMATICS, ARTS, HUMANITIES, SOCIAL_SCIENCE, BUSINESS, LAW, MEDICINE, COMPUTER_SCIENCE, ENVIRONMENT, DESIGN, EDUCATION, OTHER
4. Estimate age range if determinable (null otherwise). High school = minAge 14, maxAge 18. University = minAge 17, maxAge 25.

Articles:
${articleList}

Return ONLY a JSON array:
[{"index":0,"type":"SCHOLARSHIP","subjects":["SCIENCE","STEM"],"minAge":14,"maxAge":18}]

Rules:
- subjects is an array, can have multiple values
- minAge and maxAge are integers or null
- If NO articles match, return "NONE"
- No markdown, no explanation, just the JSON array`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text === 'NONE' || text === '') {
      return [];
    }

    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    const parsed = JSON.parse(text) as Array<{
      index: number;
      type: string;
      subjects?: string[];
      minAge?: number | null;
      maxAge?: number | null;
    }>;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry) =>
          typeof entry.index === 'number' &&
          entry.index >= 0 &&
          entry.index < items.length &&
          VALID_TYPES.has(entry.type),
      )
      .map((entry) => ({
        ...items[entry.index],
        type: entry.type as OpportunityType,
        subjects: (entry.subjects ?? []).filter((s) =>
          VALID_SUBJECTS.has(s),
        ) as Subject[],
        minAge: typeof entry.minAge === 'number' ? entry.minAge : null,
        maxAge: typeof entry.maxAge === 'number' ? entry.maxAge : null,
      }));
  } catch (error) {
    console.error(
      '[Gemini classify error]',
      error instanceof Error ? error.message : error,
    );
    return items.map((item) => ({
      ...item,
      type: 'OTHER' as OpportunityType,
      subjects: [] as Subject[],
      minAge: null,
      maxAge: null,
    }));
  }
};
```

- [ ] **Step 2: Update app/api/news/route.ts to use classifyWithGemini**

Replace `filterWithGemini` import with `classifyWithGemini` in `app/api/news/route.ts`:

```ts
import { classifyWithGemini } from '@/lib/gemini-filter';
```

And change the call:
```ts
const filtered = await classifyWithGemini(allNews);
```

Remove the `filter` query param logic (no longer needed — classification replaces filtering).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Compiles without errors

- [ ] **Step 4: Test the API**

Run: `curl -s "http://localhost:3000/api/news" | node -e "let c=[];process.stdin.on('data',d=>c.push(d));process.stdin.on('end',()=>{const j=JSON.parse(Buffer.concat(c));j.opportunities?.slice(0,3).forEach(n=>console.log(n.type, n.subjects, n.minAge, n.maxAge, n.title.substring(0,50)))})"`

Expected: Each opportunity shows type, subjects array, and age range

- [ ] **Step 5: Commit**

```bash
git add lib/gemini-filter.ts app/api/news/route.ts
git commit -m "feat: enhance Gemini classifier with subjects and age range"
```

---

### Task 3: Add new high school opportunity sites

**Files:**
- Modify: `lib/sites.ts`

- [ ] **Step 1: Inspect scholarship-positions.com HTML**

Run:
```bash
node -e "
const cheerio = require('cheerio');
fetch('https://scholarship-positions.com/category/mongolia/').then(r=>r.text()).then(html=>{
  const \$ = cheerio.load(html);
  \$('article.post').slice(0,2).each((i,el)=>{
    const e = \$(el);
    console.log('---');
    console.log('title:', e.find('h2.entry-title a').text().trim().substring(0,80));
    console.log('link:', e.find('h2.entry-title a').attr('href'));
    console.log('img:', e.find('img.wp-post-image').attr('data-lazy-src') || e.find('img.wp-post-image').attr('src'));
    console.log('excerpt:', e.find('.entry-summary').text().trim().substring(0,80));
  });
}).catch(e=>console.error(e.message));
"
```

Verify selectors work and adjust if needed.

- [ ] **Step 2: Add scholarship-positions.com site config**

Add to the `sites` array in `lib/sites.ts`:

```ts
{
  name: 'Scholarship Positions',
  url: 'https://scholarship-positions.com/category/mongolia/',
  lang: 'en',
  selectors: {
    articleList: 'article.post',
    title: 'h2.entry-title a',
    link: 'h2.entry-title a',
    date: '',
    excerpt: '.entry-summary',
    image: 'img.wp-post-image',
  },
},
```

Note: The `image` selector may need `data-lazy-src` handling. Check step 1 output and adjust the scraper if needed.

- [ ] **Step 3: Test scraping the new site**

Run: `curl -s "http://localhost:3000/api/news?source=Scholarship" | node -e "let c=[];process.stdin.on('data',d=>c.push(d));process.stdin.on('end',()=>{const j=JSON.parse(Buffer.concat(c));console.log('total:',j.total);j.opportunities?.slice(0,3).forEach(n=>console.log('-',n.title.substring(0,70)))})"`

Expected: Articles from scholarship-positions.com appear

- [ ] **Step 4: Commit**

```bash
git add lib/sites.ts
git commit -m "feat: add scholarship-positions.com for high school opportunities"
```

---

### Task 4: Create POST /api/scrape endpoint

**Files:**
- Create: `app/api/scrape/route.ts`

- [ ] **Step 1: Create the scrape route**

Create `app/api/scrape/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { classifyWithGemini } from '@/lib/gemini-filter';
import { prisma } from '@/lib/prisma';
import { scrapeAllSites } from '@/lib/scraper';
import { sites } from '@/lib/sites';

export async function POST() {
  const errors: string[] = [];
  let scraped = 0;
  let saved = 0;

  try {
    const allItems = await scrapeAllSites(sites);
    scraped = allItems.length;

    const classified = await classifyWithGemini(allItems);

    for (const item of classified) {
      try {
        const source = await prisma.scrapedSource.upsert({
          where: { url: item.sourceUrl },
          update: { lastScrapedAt: new Date() },
          create: {
            name: item.sourceName,
            url: item.sourceUrl,
          },
        });

        await prisma.opportunity.upsert({
          where: { originalUrl: item.originalUrl },
          update: {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            type: item.type,
            subjects: item.subjects,
            minAge: item.minAge,
            maxAge: item.maxAge,
            scrapedAt: new Date(),
          },
          create: {
            sourceId: source.id,
            title: item.title,
            description: item.description,
            originalUrl: item.originalUrl,
            imageUrl: item.imageUrl,
            originalLang: item.originalLang,
            type: item.type,
            subjects: item.subjects,
            minAge: item.minAge,
            maxAge: item.maxAge,
          },
        });

        saved++;
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to save "${item.title.substring(0, 50)}": ${msg}`);
      }
    }

    return NextResponse.json({ scraped, classified: classified.length, saved, errors });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Scrape failed', detail: message },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles without errors

- [ ] **Step 3: Test the scrape endpoint**

Run: `curl -s -X POST "http://localhost:3000/api/scrape" | node -e "let c=[];process.stdin.on('data',d=>c.push(d));process.stdin.on('end',()=>console.log(JSON.parse(Buffer.concat(c))))"`

Expected: `{ scraped: ~30+, classified: ~10+, saved: ~10+, errors: [] }`

- [ ] **Step 4: Verify data in Supabase**

Run: `npx prisma studio`
Expected: Opportunity table has rows, ScrapedSource table has entries for each site

- [ ] **Step 5: Commit**

```bash
git add app/api/scrape/route.ts
git commit -m "feat: add POST /api/scrape endpoint to save opportunities to Supabase"
```

---

### Task 5: Create GET /api/opportunities endpoint

**Files:**
- Create: `app/api/opportunities/route.ts`

- [ ] **Step 1: Create the opportunities route**

Create `app/api/opportunities/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { OpportunityType, Subject } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type') as OpportunityType | null;
    const subject = searchParams.get('subject') as Subject | null;
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (type) {
      where.type = type;
    }

    if (subject) {
      where.subjects = { has: subject };
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: { source: { select: { name: true, url: true } } },
      orderBy: { scrapedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      total: opportunities.length,
      opportunities: opportunities.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        originalUrl: o.originalUrl,
        imageUrl: o.imageUrl,
        type: o.type,
        subjects: o.subjects,
        minAge: o.minAge,
        maxAge: o.maxAge,
        status: o.status,
        scrapedAt: o.scrapedAt,
        sourceName: o.source.name,
        sourceUrl: o.source.url,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch opportunities', detail: message },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles without errors

- [ ] **Step 3: Test the endpoint**

Run: `curl -s "http://localhost:3000/api/opportunities" | node -e "let c=[];process.stdin.on('data',d=>c.push(d));process.stdin.on('end',()=>{const j=JSON.parse(Buffer.concat(c));console.log('total:',j.total);j.opportunities?.slice(0,3).forEach(n=>console.log('-','['+n.type+']',n.subjects,n.title.substring(0,50)))})"`

Expected: Opportunities from DB with type and subjects

Test with filters:
```bash
curl -s "http://localhost:3000/api/opportunities?type=SCHOLARSHIP"
curl -s "http://localhost:3000/api/opportunities?subject=SCIENCE"
curl -s "http://localhost:3000/api/opportunities?search=тэтгэлэг"
```

- [ ] **Step 4: Commit**

```bash
git add app/api/opportunities/route.ts
git commit -m "feat: add GET /api/opportunities endpoint reading from Supabase"
```

---

### Task 6: Update main page to read from database

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update page to use /api/opportunities and add filters**

Replace `app/page.tsx` with:

```tsx
'use client';

import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  originalUrl: string;
  imageUrl: string | null;
  type: string;
  subjects: string[];
  minAge: number | null;
  maxAge: number | null;
  scrapedAt: string;
  sourceName: string;
}

interface ApiResponse {
  total: number;
  opportunities: Opportunity[];
}

const TYPE_COLORS: Record<string, string> = {
  SCHOLARSHIP: 'bg-green-100 text-green-800',
  JOB: 'bg-blue-100 text-blue-800',
  GRANT: 'bg-purple-100 text-purple-800',
  INTERNSHIP: 'bg-orange-100 text-orange-800',
  COMPETITION: 'bg-red-100 text-red-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const TYPE_LABELS: Record<string, string> = {
  SCHOLARSHIP: 'Тэтгэлэг',
  JOB: 'Ажлын байр',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  COMPETITION: 'Тэмцээн',
  OTHER: 'Бусад',
};

const TYPE_OPTIONS = ['SCHOLARSHIP', 'JOB', 'GRANT', 'INTERNSHIP', 'COMPETITION'];

export default function HomePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = (type: string | null, query: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (query) params.set('search', query);

    fetch(`/api/opportunities?${params}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError('Мэдээлэл ачаалахад алдаа гарлаа');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(null, '');
  }, []);

  const handleTypeFilter = (type: string) => {
    const next = activeType === type ? null : type;
    setActiveType(next);
    fetchData(next, search);
  };

  const handleSearch = () => {
    fetchData(activeType, search);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Оюутны боломжууд</h1>
      <p className="mb-6 text-muted-foreground">
        Тэтгэлэг, ажлын байр, грант, дадлага, тэмцээний мэдээлэл
      </p>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-xs"
        />
        <Button onClick={handleSearch} variant="outline">
          Хайх
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((type) => (
          <Button
            key={type}
            variant={activeType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeFilter(type)}
            className={activeType === type ? '' : TYPE_COLORS[type]}
          >
            {TYPE_LABELS[type]}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="mt-2 h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {data && !loading && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {data.total} боломж олдлоо
          </p>

          {data.total === 0 && (
            <p className="text-muted-foreground">
              Боломж олдсонгүй. Эхлээд дээрх &quot;Шинэчлэх&quot; товчийг дарна уу.
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {data.opportunities.map((item) => (
              <a
                key={item.id}
                href={item.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-40 w-full rounded-t-lg object-cover"
                    />
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={TYPE_COLORS[item.type] ?? TYPE_COLORS.OTHER}
                      >
                        {TYPE_LABELS[item.type] ?? item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.sourceName}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-base leading-snug">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.description && (
                      <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {(item.minAge || item.maxAge) && (
                      <p className="text-xs text-muted-foreground">
                        Нас: {item.minAge ?? '?'}–{item.maxAge ?? '?'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles without errors

- [ ] **Step 3: Test in browser**

Run: `npm run dev`
Open: http://localhost:3000

Expected: Page loads, shows opportunities from DB. Filter buttons and search work. If DB is empty, shows "Боломж олдсонгүй" message.

- [ ] **Step 4: Trigger a scrape to populate data**

Run: `curl -s -X POST "http://localhost:3000/api/scrape"`
Then refresh the page.

Expected: Cards appear with type badges, subjects, and age ranges.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update main page to read from Supabase with filters"
```

---

### Task 7: Final verification and cleanup

**Files:**
- Verify all routes work together

- [ ] **Step 1: Full end-to-end test**

1. Trigger scrape: `curl -s -X POST "http://localhost:3000/api/scrape"`
2. Read all: `curl -s "http://localhost:3000/api/opportunities"`
3. Filter by type: `curl -s "http://localhost:3000/api/opportunities?type=SCHOLARSHIP"`
4. Search: `curl -s "http://localhost:3000/api/opportunities?search=scholarship"`
5. Open browser: http://localhost:3000

Expected: All return data, filters work, UI displays cards.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: complete Supabase integration with scraper and opportunity feed"
```
