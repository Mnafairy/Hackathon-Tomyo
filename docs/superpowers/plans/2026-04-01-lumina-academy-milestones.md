# Lumina Academy — Full Milestone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete opportunity discovery platform for Mongolian high school students — from scraping pipeline through personalized feed to admin dashboard and production deployment.

**Architecture:** Next.js 16 App Router with Server Components by default, Prisma ORM on Supabase PostgreSQL, NextAuth for authentication, Gemini API for classification/translation, Cheerio for scraping. Data flows: Scrapers → Gemini classification → DB → Server Components render feed. Bookmarks, preferences, and admin CRUD use Server Actions.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma 7, Supabase PostgreSQL, NextAuth 4, Gemini API, Cheerio, Tailwind CSS 4, shadcn/ui, Vercel (deploy + cron)

---

## What's Already Done (Skip These)

| Item | Status |
|------|--------|
| Next.js + TypeScript + Tailwind + shadcn | ✅ Done |
| Prisma schema (User, Opportunity, ScrapedSource, Translation, SavedOpportunity) | ✅ Done |
| Supabase PostgreSQL connected | ✅ Done |
| NextAuth with email/password (Credentials provider) | ✅ Done |
| Navbar, Footer, 4 page layouts (Home, Discovery, Community, Profile) | ✅ Done |
| Cheerio scrapers for 4 sources (NUM, MSUE, ScholarshipPositions, Scholars4Dev) | ✅ Done |
| Scrape API route (POST /api/scrape) with dedup | ✅ Done |
| Gemini classification (type, subjects, age range) | ✅ Done |
| Opportunities API (GET /api/opportunities with filters) | ✅ Done |
| Basic discovery page with client-side search + type/subject filters | ✅ Done |

---

## File Structure (New & Modified Files)

```
prisma/
  schema.prisma                          # MODIFY: add role, UserPreference, indexes
  migrations/                            # AUTO: new migration

lib/
  auth.ts                                # MODIFY: add Google OAuth provider
  gemini-translate.ts                    # CREATE: translation via Gemini
  validators.ts                          # CREATE: Zod schemas

actions/
  bookmarks.ts                           # CREATE: save/unsave opportunity
  profile.ts                             # CREATE: update profile, preferences
  opportunities.ts                       # CREATE: admin CRUD for opportunities

app/
  api/
    auth/[...nextauth]/route.ts          # (no change — uses lib/auth.ts)
    opportunities/[id]/route.ts          # CREATE: single opportunity GET
    opportunities/[id]/bookmark/route.ts # CREATE: bookmark toggle API
    translate/route.ts                   # CREATE: Gemini translation endpoint
    cron/scrape/route.ts                 # CREATE: Vercel Cron handler

  (shop)/
    discovery/
      page.tsx                           # MODIFY: connect to real API, infinite scroll, bookmarks
      [id]/page.tsx                      # CREATE: opportunity detail page
    profile/
      page.tsx                           # MODIFY: connect to real user data
    saved/page.tsx                       # CREATE: saved/bookmarked opportunities page

  admin/
    layout.tsx                           # CREATE: admin layout with auth guard
    page.tsx                             # CREATE: dashboard overview
    opportunities/page.tsx               # CREATE: opportunity management
    scraper/page.tsx                     # CREATE: scraper health monitor

components/
  layout/Navbar.tsx                      # MODIFY: auth-aware (sign in/out, user avatar)
  layout/MobileNav.tsx                   # CREATE: mobile hamburger menu
  features/
    OpportunityCard.tsx                  # CREATE: reusable card with bookmark button
    BookmarkButton.tsx                   # CREATE: client component for bookmark toggle
    InfiniteScroll.tsx                   # CREATE: infinite scroll wrapper

vercel.json                              # CREATE: cron job config
```

---

## Milestone 1 — Auth Enhancements

### Task 1: Add Google OAuth Provider

**Files:**
- Modify: `lib/auth.ts`
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Add Google provider to auth config**

```ts
// lib/auth.ts
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as AuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'hackathon-secret-key-change-in-prod',
};
```

- [ ] **Step 2: Add env vars placeholder**

Add to `.env.local`:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

- [ ] **Step 3: Update Navbar to be auth-aware**

Replace the hardcoded avatar in `components/layout/Navbar.tsx` with session-based UI. Use `useSession()` from `next-auth/react`. Show "Нэвтрэх" button when signed out, user initial + sign out when signed in.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Compiles successfully

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts components/layout/Navbar.tsx .env.local
git commit -m "feat: add Google OAuth provider and auth-aware navbar"
```

---

### Task 2: Add Admin Role to User Model

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `lib/auth-utils.ts`

- [ ] **Step 1: Add role enum and field to schema**

Add to `prisma/schema.prisma`:

```prisma
enum UserRole {
  USER
  ADMIN
}
```

Add to `User` model:
```prisma
role UserRole @default(USER)
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add-user-role
```

- [ ] **Step 3: Create auth utils**

```ts
// lib/auth-utils.ts
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const getSession = async () => {
  return getServerSession(authOptions);
};

export const requireAuth = async () => {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user;
};

export const requireAdmin = async () => {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  return session.user;
};
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ lib/auth-utils.ts
git commit -m "feat: add admin role to user model and auth utils"
```

---

## Milestone 2 — Data Pipeline Improvements

### Task 3: Add Database Indexes for Performance

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add indexes to Opportunity model**

Add inside the `Opportunity` model:
```prisma
@@index([status, type])
@@index([status, scrapedAt])
@@index([status])
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add-opportunity-indexes
```

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "perf: add database indexes on opportunity status, type, scrapedAt"
```

---

### Task 4: Vercel Cron Job for Scraping

**Files:**
- Create: `app/api/cron/scrape/route.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create cron route handler**

```ts
// app/api/cron/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { classifyWithGemini } from '@/lib/gemini-filter';
import { prisma } from '@/lib/prisma';
import { scrapeAllSites } from '@/lib/scraper';
import { sites } from '@/lib/sites';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let scraped = 0;
  let saved = 0;
  const errors: string[] = [];

  try {
    const allItems = await scrapeAllSites(sites);
    scraped = allItems.length;

    const classified = await classifyWithGemini(allItems);

    for (const item of classified) {
      try {
        const source = await prisma.scrapedSource.upsert({
          where: { url: item.sourceUrl },
          update: { lastScrapedAt: new Date() },
          create: { name: item.sourceName, url: item.sourceUrl },
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
        const msg = error instanceof Error ? error.message : 'Unknown';
        errors.push(`"${item.title.substring(0, 40)}": ${msg}`);
      }
    }

    return NextResponse.json({
      ok: true,
      scraped,
      classified: classified.length,
      saved,
      errors: errors.slice(0, 5),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create vercel.json with cron config**

```json
{
  "crons": [
    {
      "path": "/api/cron/scrape",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

- [ ] **Step 3: Add CRON_SECRET to .env.local**

```
CRON_SECRET=lumina-cron-secret-change-in-prod
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add app/api/cron/ vercel.json .env.local
git commit -m "feat: add Vercel cron job for automatic scraping every 6 hours"
```

---

## Milestone 3 — Gemini Translation

### Task 5: Gemini Translation Service

**Files:**
- Create: `lib/gemini-translate.ts`
- Create: `app/api/translate/route.ts`

- [ ] **Step 1: Create translation service**

```ts
// lib/gemini-translate.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

import { prisma } from '@/lib/prisma';

interface TranslationResult {
  title: string;
  description: string;
  summary: string;
}

export const translateOpportunity = async (
  opportunityId: string,
  targetLang: string = 'mn',
): Promise<TranslationResult> => {
  const existing = await prisma.translation.findUnique({
    where: { opportunityId_targetLang: { opportunityId, targetLang } },
  });

  if (existing?.status === 'COMPLETED') {
    return {
      title: existing.title,
      description: existing.description,
      summary: existing.summary ?? '',
    };
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  if (opportunity.originalLang === targetLang) {
    return {
      title: opportunity.title,
      description: opportunity.description,
      summary: '',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Translate this opportunity posting to Mongolian (mn). Return JSON only:
{"title":"...","description":"...","summary":"..."}

The summary should be 1-2 sentences explaining why this is relevant for Mongolian high school students.

Title: ${opportunity.title}
Description: ${opportunity.description}`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    const parsed = JSON.parse(text) as TranslationResult;

    await prisma.translation.upsert({
      where: { opportunityId_targetLang: { opportunityId, targetLang } },
      update: {
        title: parsed.title,
        description: parsed.description,
        summary: parsed.summary,
        status: 'COMPLETED',
        geminiModel: 'gemini-2.5-flash',
      },
      create: {
        opportunityId,
        targetLang,
        title: parsed.title,
        description: parsed.description,
        summary: parsed.summary,
        status: 'COMPLETED',
        geminiModel: 'gemini-2.5-flash',
      },
    });

    return parsed;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';

    await prisma.translation.upsert({
      where: { opportunityId_targetLang: { opportunityId, targetLang } },
      update: { status: 'FAILED', errorMessage },
      create: {
        opportunityId,
        targetLang,
        title: opportunity.title,
        description: opportunity.description,
        status: 'FAILED',
        errorMessage,
      },
    });

    throw error;
  }
};
```

- [ ] **Step 2: Create translate API route**

```ts
// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { translateOpportunity } from '@/lib/gemini-translate';

export async function POST(req: NextRequest) {
  try {
    const { opportunityId, targetLang } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'opportunityId required' }, { status: 400 });
    }

    const result = await translateOpportunity(opportunityId, targetLang ?? 'mn');
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add lib/gemini-translate.ts app/api/translate/
git commit -m "feat: add Gemini translation service for opportunities"
```

---

## Milestone 4 — Feed & Core UI

### Task 6: Reusable OpportunityCard Component

**Files:**
- Create: `components/features/OpportunityCard.tsx`
- Create: `components/features/BookmarkButton.tsx`

- [ ] **Step 1: Create BookmarkButton client component**

```tsx
// components/features/BookmarkButton.tsx
'use client';

import { useState } from 'react';

interface BookmarkButtonProps {
  opportunityId: string;
  initialSaved: boolean;
}

export const BookmarkButton = ({ opportunityId, initialSaved }: BookmarkButtonProps) => {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/bookmark`, {
        method: 'POST',
      });
      if (res.ok) {
        setSaved(!saved);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-on-surface-variant transition-colors hover:text-ds-primary disabled:opacity-50"
      aria-label={saved ? 'Хадгалсан' : 'Хадгалах'}
    >
      <svg className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
};
```

- [ ] **Step 2: Create OpportunityCard server component**

```tsx
// components/features/OpportunityCard.tsx
import Link from 'next/link';

import { BookmarkButton } from '@/components/features/BookmarkButton';

const TYPE_LABELS: Record<string, string> = {
  SCHOLARSHIP: 'Тэтгэлэг',
  JOB: 'Ажлын байр',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  COMPETITION: 'Тэмцээн',
  OTHER: 'Бусад',
};

const TYPE_COLORS: Record<string, string> = {
  COMPETITION: 'bg-ds-primary-container text-on-primary-container',
  SCHOLARSHIP: 'bg-tertiary-container text-on-tertiary-container',
  INTERNSHIP: 'bg-secondary-container text-on-secondary-container',
  GRANT: 'bg-ds-tertiary/20 text-ds-tertiary',
  JOB: 'bg-surface-container-highest text-on-surface',
  OTHER: 'bg-surface-container-highest text-on-surface',
};

interface OpportunityCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  organization?: string | null;
  meta?: string;
  isSaved?: boolean;
  className?: string;
  animationDelay?: string;
}

export const OpportunityCard = ({
  id,
  title,
  description,
  type,
  organization,
  meta,
  isSaved = false,
  className = '',
  animationDelay = '',
}: OpportunityCardProps) => {
  return (
    <div className={`glass-card glow-border rounded-2xl p-5 animate-fade-up ${animationDelay} ${className}`}>
      <div className="mb-3 flex items-start justify-between">
        <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[type] ?? TYPE_COLORS.OTHER}`}>
          {TYPE_LABELS[type] ?? type}
        </span>
        <BookmarkButton opportunityId={id} initialSaved={isSaved} />
      </div>

      <Link href={`/discovery/${id}`} className="group">
        <h3 className="line-clamp-1 font-bold text-on-surface transition-colors group-hover:text-ds-primary">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{description}</p>
      </Link>

      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-on-surface">{organization ?? 'N/A'}</span>
        {meta && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{meta}</span>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add components/features/
git commit -m "feat: add reusable OpportunityCard and BookmarkButton components"
```

---

### Task 7: Bookmark API Route

**Files:**
- Create: `app/api/opportunities/[id]/bookmark/route.ts`
- Create: `app/api/opportunities/[id]/route.ts`

- [ ] **Step 1: Create bookmark toggle endpoint**

```ts
// app/api/opportunities/[id]/bookmark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.savedOpportunity.findUnique({
    where: { userId_opportunityId: { userId: session.user.id, opportunityId: id } },
  });

  if (existing) {
    await prisma.savedOpportunity.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedOpportunity.create({
    data: { userId: session.user.id, opportunityId: id },
  });

  return NextResponse.json({ saved: true });
}
```

- [ ] **Step 2: Create single opportunity GET endpoint**

```ts
// app/api/opportunities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      source: { select: { name: true, url: true } },
      translations: { where: { targetLang: 'mn', status: 'COMPLETED' } },
    },
  });

  if (!opportunity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(opportunity);
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add app/api/opportunities/\[id\]/
git commit -m "feat: add bookmark toggle and single opportunity API routes"
```

---

### Task 8: Opportunity Detail Page

**Files:**
- Create: `app/(shop)/discovery/[id]/page.tsx`

- [ ] **Step 1: Create detail page**

```tsx
// app/(shop)/discovery/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { BookmarkButton } from '@/components/features/BookmarkButton';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { id },
    select: { title: true, description: true },
  });

  if (!opp) return { title: 'Олдсонгүй' };

  return {
    title: `${opp.title} | Lumina Academy`,
    description: opp.description.substring(0, 160),
  };
};

const TYPE_LABELS: Record<string, string> = {
  SCHOLARSHIP: 'Тэтгэлэг',
  JOB: 'Ажлын байр',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  COMPETITION: 'Тэмцээн',
  OTHER: 'Бусад',
};

const SUBJECT_LABELS: Record<string, string> = {
  STEM: 'STEM', SCIENCE: 'Шинжлэх ухаан', TECHNOLOGY: 'Технологи',
  ENGINEERING: 'Инженерчлэл', MATHEMATICS: 'Математик', ARTS: 'Урлаг',
  HUMANITIES: 'Хүмүүнлэгийн ухаан', SOCIAL_SCIENCE: 'Нийгмийн ухаан',
  BUSINESS: 'Бизнес', COMPUTER_SCIENCE: 'Компьютерийн ухаан',
  ENVIRONMENT: 'Байгаль орчин', DESIGN: 'Дизайн', EDUCATION: 'Боловсрол',
  OTHER: 'Бусад',
};

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      source: { select: { name: true } },
      translations: { where: { targetLang: 'mn', status: 'COMPLETED' }, take: 1 },
    },
  });

  if (!opportunity) notFound();

  const translation = opportunity.translations[0];
  const displayTitle = translation?.title ?? opportunity.title;
  const displayDesc = translation?.description ?? opportunity.description;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/discovery" className="mb-6 inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-ds-primary">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Буцах
      </Link>

      <div className="glass-panel animate-fade-up rounded-2xl p-8">
        <div className="mb-4 flex items-start justify-between">
          <span className="rounded-md bg-ds-primary-container px-3 py-1 text-sm font-medium text-on-primary-container">
            {TYPE_LABELS[opportunity.type] ?? opportunity.type}
          </span>
          <BookmarkButton opportunityId={opportunity.id} initialSaved={false} />
        </div>

        <h1 className="heading-display text-2xl font-bold text-on-background md:text-3xl">
          {displayTitle}
        </h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {opportunity.subjects.map((s) => (
            <span key={s} className="rounded-full bg-surface-container-highest px-3 py-1 text-xs text-on-surface-variant">
              {SUBJECT_LABELS[s] ?? s}
            </span>
          ))}
        </div>

        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

        <div className="mt-6 space-y-4 text-on-surface-variant leading-relaxed">
          {displayDesc.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {translation?.summary && (
          <div className="mt-6 rounded-xl bg-ds-primary/5 border border-ds-primary/10 p-4">
            <p className="text-sm font-medium text-ds-primary">AI Хураангуй</p>
            <p className="mt-1 text-sm text-on-surface-variant">{translation.summary}</p>
          </div>
        )}

        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {opportunity.organization && (
            <div>
              <p className="text-on-surface-variant">Байгууллага</p>
              <p className="font-medium text-on-surface">{opportunity.organization}</p>
            </div>
          )}
          {opportunity.source && (
            <div>
              <p className="text-on-surface-variant">Эх сурвалж</p>
              <p className="font-medium text-on-surface">{opportunity.source.name}</p>
            </div>
          )}
          {(opportunity.minAge || opportunity.maxAge) && (
            <div>
              <p className="text-on-surface-variant">Насны хязгаар</p>
              <p className="font-medium text-on-surface">{opportunity.minAge ?? '?'} — {opportunity.maxAge ?? '?'} нас</p>
            </div>
          )}
          {opportunity.deadline && (
            <div>
              <p className="text-on-surface-variant">Хугацаа</p>
              <p className="font-medium text-on-surface">{new Date(opportunity.deadline).toLocaleDateString('mn-MN')}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <a
            href={opportunity.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-6 py-3 text-sm font-semibold text-on-primary-fixed"
          >
            Эх сурвалж руу зочлох
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add app/\(shop\)/discovery/\[id\]/
git commit -m "feat: add opportunity detail page with translation support"
```

---

### Task 9: Connect Discovery Page to Real API with Pagination

**Files:**
- Modify: `app/(shop)/discovery/page.tsx`
- Modify: `app/api/opportunities/route.ts`

- [ ] **Step 1: Add pagination to opportunities API**

Update `app/api/opportunities/route.ts` to accept `cursor` and `limit` params:

Add after the existing `search` param parsing:
```ts
const cursor = searchParams.get('cursor');
const limit = Math.min(Number(searchParams.get('limit') ?? '12'), 50);
```

Update the `findMany` to:
```ts
const opportunities = await prisma.opportunity.findMany({
  where,
  include: { source: { select: { name: true, url: true } } },
  orderBy: { scrapedAt: 'desc' },
  take: limit + 1,
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
});

const hasMore = opportunities.length > limit;
const items = hasMore ? opportunities.slice(0, limit) : opportunities;
const nextCursor = hasMore ? items[items.length - 1].id : null;
```

Update return to include `nextCursor` and `hasMore`.

- [ ] **Step 2: Update discovery page to fetch from API**

Modify `app/(shop)/discovery/page.tsx` to replace hardcoded CARDS with a `useEffect` fetch from `/api/opportunities` and a "Load More" button that fetches the next page using `cursor`.

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add app/api/opportunities/route.ts app/\(shop\)/discovery/page.tsx
git commit -m "feat: connect discovery page to real API with cursor pagination"
```

---

### Task 10: Saved Opportunities Page

**Files:**
- Create: `app/(shop)/saved/page.tsx`

- [ ] **Step 1: Create saved opportunities page**

A Server Component that queries `SavedOpportunity` for the current user and renders a grid of `OpportunityCard` components. If not signed in, show a sign-in prompt. Uses `getServerSession` from `next-auth`.

- [ ] **Step 2: Add "Хадгалсан" link to Navbar**

Add between "Профайл" and the button in `Navbar.tsx`.

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add app/\(shop\)/saved/ components/layout/Navbar.tsx
git commit -m "feat: add saved/bookmarked opportunities page"
```

---

## Milestone 5 — Personalization & Engagement

### Task 11: User Preference Model & Onboarding

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `actions/profile.ts`

- [ ] **Step 1: Add UserPreference to schema**

```prisma
model UserPreference {
  id     String    @id @default(cuid())
  userId String    @unique
  user   User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  interests     Subject[]
  preferredTypes OpportunityType[]
  minAge        Int?
  maxAge        Int?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Add to `User` model: `preferences UserPreference?`

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add-user-preferences
```

- [ ] **Step 3: Create profile server action**

```ts
// actions/profile.ts
'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const updatePreferences = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Нэвтэрнэ үү' };

  const interests = formData.getAll('interests') as string[];
  const types = formData.getAll('types') as string[];

  try {
    await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: { interests, preferredTypes: types },
      create: { userId: session.user.id, interests, preferredTypes: types },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Алдаа гарлаа' };
  }
};
```

- [ ] **Step 4: Verify build & commit**

```bash
npm run build
git add prisma/ actions/profile.ts
git commit -m "feat: add user preferences model and server action"
```

---

### Task 12: Personalized Feed Ranking

**Files:**
- Modify: `app/api/opportunities/route.ts`

- [ ] **Step 1: Update opportunities API to accept userId and rank by preferences**

When a `userId` query param is present, look up their `UserPreference`, then sort results: opportunities matching their `interests` and `preferredTypes` rank higher. Use Prisma `orderBy` with a computed relevance score, or do two queries (matching first, then non-matching) and concat.

- [ ] **Step 2: Verify build & commit**

```bash
npm run build
git add app/api/opportunities/route.ts
git commit -m "feat: personalized feed ranking based on user preferences"
```

---

### Task 13: Trending & Ending Soon Sections on Discovery

**Files:**
- Modify: `app/(shop)/discovery/page.tsx`

- [ ] **Step 1: Add horizontal scroll sections above the grid**

Query opportunities with `deadline` in the next 7 days as "Удахгүй дуусах" and opportunities with most bookmarks as "Трэнд". Render as horizontal scrollable card rows above the main grid.

- [ ] **Step 2: Verify build & commit**

```bash
npm run build
git add app/\(shop\)/discovery/page.tsx
git commit -m "feat: add trending and ending soon sections to discovery"
```

---

## Milestone 6 — Admin Dashboard

### Task 14: Admin Layout & Dashboard

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create admin layout with auth guard**

```tsx
// app/admin/layout.tsx
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth-utils';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="glass-panel w-64 border-r border-outline-variant/20 p-6">
        <h2 className="heading-section mb-8 text-lg font-bold text-ds-primary">Админ</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high">Хянах самбар</a>
          <a href="/admin/opportunities" className="block rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high">Боломжууд</a>
          <a href="/admin/scraper" className="block rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high">Скрэйпэр</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create dashboard page with stats**

```tsx
// app/admin/page.tsx
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [totalOpps, activeOpps, totalUsers, totalSources] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count(),
    prisma.scrapedSource.count(),
  ]);

  const stats = [
    { label: 'Нийт боломж', value: totalOpps, color: 'text-ds-primary' },
    { label: 'Идэвхтэй', value: activeOpps, color: 'text-ds-secondary' },
    { label: 'Хэрэглэгч', value: totalUsers, color: 'text-ds-tertiary' },
    { label: 'Эх сурвалж', value: totalSources, color: 'text-ds-primary' },
  ];

  return (
    <div>
      <h1 className="heading-display mb-8 text-3xl font-bold text-on-background">Хянах самбар</h1>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel rounded-2xl p-6">
            <p className={`heading-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build & commit**

```bash
npm run build
git add app/admin/
git commit -m "feat: add admin dashboard with stats overview"
```

---

### Task 15: Admin Opportunity Management

**Files:**
- Create: `app/admin/opportunities/page.tsx`
- Create: `actions/opportunities.ts`

- [ ] **Step 1: Create admin server actions for CRUD**

Server actions: `deleteOpportunity(id)`, `updateOpportunityStatus(id, status)`, `createOpportunity(formData)`. All call `requireAdmin()` first.

- [ ] **Step 2: Create opportunity management page**

Table listing all opportunities with status badges, edit/delete buttons, and a "Create" form. Uses Server Components with Server Actions for mutations.

- [ ] **Step 3: Verify build & commit**

```bash
npm run build
git add app/admin/opportunities/ actions/opportunities.ts
git commit -m "feat: add admin opportunity management page"
```

---

### Task 16: Scraper Health Monitor

**Files:**
- Create: `app/admin/scraper/page.tsx`

- [ ] **Step 1: Create scraper monitoring page**

Query `ScrapedSource` with `lastScrapedAt`, count opportunities per source, show health status (green if scraped within 24h, yellow within 48h, red otherwise). Add a "Scrape Now" button that POSTs to `/api/scrape`.

- [ ] **Step 2: Verify build & commit**

```bash
npm run build
git add app/admin/scraper/
git commit -m "feat: add scraper health monitoring page"
```

---

## Milestone 7 — Polish & Launch

### Task 17: Mobile Navigation

**Files:**
- Create: `components/layout/MobileNav.tsx`
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Create MobileNav component**

A `'use client'` drawer/sheet that opens on hamburger click, shows all nav links + auth status. Uses shadcn Sheet component.

- [ ] **Step 2: Add hamburger button to Navbar (visible on md:hidden)**

- [ ] **Step 3: Verify build & commit**

```bash
npm run build
git add components/layout/
git commit -m "feat: add mobile navigation drawer"
```

---

### Task 18: SEO & OpenGraph Meta Tags

**Files:**
- Modify: `app/(shop)/layout.tsx`
- Modify: `app/(shop)/discovery/[id]/page.tsx` (already has generateMetadata)

- [ ] **Step 1: Add comprehensive metadata to shop layout**

Add `openGraph`, `twitter`, `robots`, `metadataBase` to the root layout metadata. Ensure every page exports `generateMetadata` or static `metadata`.

- [ ] **Step 2: Create sitemap**

Create `app/sitemap.ts` that queries all active opportunities and returns URLs.

- [ ] **Step 3: Create robots.txt**

Create `app/robots.ts` with standard rules.

- [ ] **Step 4: Verify build & commit**

```bash
npm run build
git add app/sitemap.ts app/robots.ts app/\(shop\)/layout.tsx
git commit -m "feat: add SEO metadata, sitemap, and robots.txt"
```

---

### Task 19: Performance — ISR for Feed Pages

**Files:**
- Modify: `app/(shop)/discovery/page.tsx`
- Modify: `app/(shop)/discovery/[id]/page.tsx`

- [ ] **Step 1: Add revalidation to discovery pages**

Add `export const revalidate = 60;` to the discovery listing page. Add `export const revalidate = 300;` to the detail page. Convert the discovery page from client component to a Server Component with server-side data fetching where possible.

- [ ] **Step 2: Verify build & commit**

```bash
npm run build
git add app/\(shop\)/discovery/
git commit -m "perf: add ISR revalidation to discovery pages"
```

---

### Task 20: Deploy to Vercel

**Files:**
- Verify: `vercel.json` (already created in Task 4)
- Verify: Environment variables

- [ ] **Step 1: Verify all env vars are documented**

Create `.env.example`:
```
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=
CRON_SECRET=
```

- [ ] **Step 2: Final build check**

```bash
npm run build
```

- [ ] **Step 3: Deploy**

```bash
vercel --prod
```

- [ ] **Step 4: Verify cron job is registered**

Check Vercel dashboard → Settings → Cron Jobs to confirm `/api/cron/scrape` is scheduled.

- [ ] **Step 5: Commit**

```bash
git add .env.example
git commit -m "chore: add env example and prepare for production deploy"
```
