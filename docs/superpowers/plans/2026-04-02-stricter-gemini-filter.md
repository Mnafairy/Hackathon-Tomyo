# Stricter Gemini Filter + Status Badges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Gemini filter stricter to reject non-opportunities (results, recaps), add keyword safety net, show active/expired status badges with deadlines on cards, update existing stale data.

**Architecture:** Enhance the Gemini prompt with confidence scoring and stronger reject examples. Add a post-Gemini regex-based keyword filter as a safety net. Update the Opportunity interface and OpportunityCard to show status badges and deadline dates. Run a migration query to fix existing data statuses before re-scraping.

**Tech Stack:** Gemini API, Prisma, Next.js API routes, React client components, Tailwind CSS

---

### Task 1: Enhance Gemini Prompt + Confidence Scoring

**Files:**
- Modify: `lib/gemini-filter.ts:104-144` (prompt string)
- Modify: `lib/gemini-filter.ts:156-164` (parsed type to include confidence)
- Modify: `lib/gemini-filter.ts:170-176` (filter to check confidence >= 3)

- [ ] **Step 1: Update the prompt string**

Replace the entire prompt template (lines 104-144) in `lib/gemini-filter.ts` with this stricter version:

```typescript
  const prompt = `You are a STRICT opportunity classifier for Mongolian high school and university students. Today is ${today}.

Given scraped articles, you must:

1. **FILTER STRICTLY** — Only keep articles that are ACTIONABLE opportunities students can apply for, register for, or participate in RIGHT NOW or in the near future.

KEEP (actionable, forward-looking):
- Scholarships, grants, fellowships with open applications
- Competitions, olympiads with upcoming/open registration (e.g. "Олимпиадын бүртгэл эхэллээ")
- Internships, programs accepting student applicants
- Upcoming events students can register for

REJECT (do NOT include in output):
- Results, outcomes, rankings, scores of past events
  Examples: "дүн гарлаа", "үр дүн", "шалгарлаа", "шалгаруулав", "байр эзэлсэн", "results", "winners", "rankings"
- Event recaps or completion reports
  Examples: "амжилттай болж өндөрлөлөө", "зохион байгуулагдлаа", "болж өнгөрлөө", "successfully concluded"
- Award ceremonies or prize-giving reports
  Examples: "шагнал гардуулав", "гардуулах ёслол"
- General news, press releases, institutional announcements
- Faculty/staff job postings (not for students)
- Informational pages with no call-to-action for students
- Content about past events that already happened
- Academic papers, research summaries, course descriptions

KEY DISTINCTION: "Олимпиадын бүртгэл эхэллээ" (registration opened) = KEEP. "Олимпиадын дүн гарлаа" (results released) = REJECT.

2. **CLASSIFY** each kept item:
- type: JOB, SCHOLARSHIP, GRANT, INTERNSHIP, COMPETITION, or OTHER
- subjects: array from [STEM, SCIENCE, TECHNOLOGY, ENGINEERING, MATHEMATICS, ARTS, HUMANITIES, SOCIAL_SCIENCE, BUSINESS, LAW, MEDICINE, COMPUTER_SCIENCE, ENVIRONMENT, DESIGN, EDUCATION, OTHER]
- minAge/maxAge: integers or null. High school = 14-18. University = 17-25.
- deadline: ISO date string ("2026-05-15") if a deadline/registration date is mentioned or inferable, otherwise null
- status: "ACTIVE" if deadline is in the future or opportunity is ongoing, "EXPIRED" if deadline has passed, "UNKNOWN" if no date is determinable
- confidence: integer 1-5, how confident you are this is an ACTIONABLE opportunity (5 = clearly actionable, 1 = probably not an opportunity)

Articles:
${articleList}

Return ONLY a JSON array:
[{"index":0,"type":"COMPETITION","subjects":["MATHEMATICS"],"minAge":14,"maxAge":18,"deadline":"2026-05-15","status":"ACTIVE","confidence":4}]

Rules:
- Be STRICT: when in doubt, REJECT the article rather than including it
- Only include items with confidence >= 3
- subjects is an array, can have multiple values
- minAge and maxAge are integers or null
- deadline is an ISO date string or null
- status is "ACTIVE", "EXPIRED", or "UNKNOWN"
- confidence is an integer 1-5
- If NO articles qualify, return "NONE"
- No markdown, no explanation, just the JSON array`;
```

- [ ] **Step 2: Update the parsed type to include confidence**

Replace the `parsed` type cast (lines 156-164) with:

```typescript
    const parsed = JSON.parse(text) as Array<{
      index: number;
      type: string;
      subjects?: string[];
      minAge?: number | null;
      maxAge?: number | null;
      deadline?: string | null;
      status?: string;
      confidence?: number;
    }>;
```

- [ ] **Step 3: Add confidence filter to the .filter() chain**

Replace the filter block (lines 170-176) with:

```typescript
    return parsed
      .filter(
        (entry) =>
          typeof entry.index === 'number' &&
          entry.index >= 0 &&
          entry.index < items.length &&
          VALID_TYPES.has(entry.type) &&
          (entry.confidence ?? 0) >= 3,
      )
```

- [ ] **Step 4: Run build to verify**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add lib/gemini-filter.ts
git commit -m "feat: stricter gemini prompt with confidence scoring"
```

---

### Task 2: Add Post-Gemini Keyword Safety Net Filter

**Files:**
- Modify: `lib/gemini-filter.ts` (add REJECT_PATTERNS constant and applyKeywordFilter function, wire into classifyWithGemini)

- [ ] **Step 1: Add REJECT_PATTERNS and filter function**

Add these after the `VALID_STATUSES` line (line 52) in `lib/gemini-filter.ts`:

```typescript
const REJECT_PATTERNS: RegExp[] = [
  /дүн\s*(гарлаа|гарсан|зарлалаа)/i,
  /үр\s*дүн/i,
  /шалгарлаа/i,
  /шалгаруулав/i,
  /байр\s*эзэлсэн/i,
  /амжилттай\s*(болж|зохион)/i,
  /өндөрлөлөө/i,
  /болж\s*өнгөрлөө/i,
  /зохион\s*байгуулагдлаа/i,
  /шагнал\s*гардуул/i,
  /гардуулах\s*ёслол/i,
  /\bresults?\b/i,
  /\bwinners?\b/i,
  /\brankings?\b/i,
  /successfully\s+concluded/i,
];

const matchesRejectPattern = (title: string, description: string): boolean => {
  const text = `${title} ${description}`;
  return REJECT_PATTERNS.some((pattern) => pattern.test(text));
};
```

- [ ] **Step 2: Wire keyword filter into the return pipeline**

In `classifyWithGemini`, after the `.filter()` and `.map()` chain that produces the results array, add a final filter. Replace the full `return parsed.filter(...).map(...)` block with:

```typescript
    return parsed
      .filter(
        (entry) =>
          typeof entry.index === 'number' &&
          entry.index >= 0 &&
          entry.index < items.length &&
          VALID_TYPES.has(entry.type) &&
          (entry.confidence ?? 0) >= 3,
      )
      .map((entry) => {
        const deadline = parseDeadline(entry.deadline);
        const rawStatus = VALID_STATUSES.has(entry.status ?? '')
          ? (entry.status as OpportunityStatus)
          : 'UNKNOWN';
        const status = resolveStatus(rawStatus, deadline);

        return {
          ...items[entry.index],
          type: entry.type as OpportunityType,
          subjects: (entry.subjects ?? []).filter((s) =>
            VALID_SUBJECTS.has(s),
          ) as Subject[],
          minAge: typeof entry.minAge === 'number' ? entry.minAge : null,
          maxAge: typeof entry.maxAge === 'number' ? entry.maxAge : null,
          deadline,
          status,
        };
      })
      .filter((item) => !matchesRejectPattern(item.title, item.description));
```

- [ ] **Step 3: Run build to verify**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add lib/gemini-filter.ts
git commit -m "feat: add post-gemini keyword safety net filter"
```

---

### Task 3: Strengthen resolveStatus Logic

**Files:**
- Modify: `lib/gemini-filter.ts:61-70` (resolveStatus function)

- [ ] **Step 1: Update resolveStatus to always trust deadline over Gemini**

Replace the `resolveStatus` function (lines 61-70) with:

```typescript
const resolveStatus = (
  status: OpportunityStatus,
  deadline: Date | null,
): OpportunityStatus => {
  if (!deadline) return status;
  const now = new Date();
  if (deadline < now) return 'EXPIRED';
  if (deadline > now) return 'ACTIVE';
  return status;
};
```

- [ ] **Step 2: Run build to verify**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add lib/gemini-filter.ts
git commit -m "fix: resolveStatus always trusts deadline over gemini assessment"
```

---

### Task 4: Add Status + Deadline to Opportunity Interface and API Response

**Files:**
- Modify: `features/discovery/discovery-data.ts:53-65` (Opportunity interface)
- Modify: `app/api/opportunities/route.ts:40-57` (API response mapping)

- [ ] **Step 1: Add status and deadline to the Opportunity interface**

Replace the `Opportunity` interface in `features/discovery/discovery-data.ts` (lines 53-65) with:

```typescript
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  originalUrl: string;
  imageUrl: string | null;
  type: string;
  subjects: string[];
  minAge: number | null;
  maxAge: number | null;
  status: string;
  deadline: string | null;
  scrapedAt: string;
  sourceName: string;
}
```

- [ ] **Step 2: Add status and deadline to the API response**

In `app/api/opportunities/route.ts`, the response mapping (lines 42-56) already includes `status`. Add `deadline`. Replace the mapping with:

```typescript
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
        deadline: o.deadline?.toISOString() ?? null,
        scrapedAt: o.scrapedAt,
        sourceName: o.source.name,
        sourceUrl: o.source.url,
      })),
```

- [ ] **Step 3: Add STATUS_BADGE_CLASSES and STATUS_LABELS to discovery-data.ts**

Add after the `SUBJECT_LABELS` constant (after line 51) in `features/discovery/discovery-data.ts`:

```typescript
export const STATUS_BADGE_CLASSES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-600',
  EXPIRED: 'bg-red-500/15 text-red-600',
  UNKNOWN: 'bg-gray-500/15 text-gray-500',
};

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Идэвхтэй',
  EXPIRED: 'Хугацаа дууссан',
  UNKNOWN: 'Тодорхойгүй',
};
```

- [ ] **Step 4: Run build to verify**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add features/discovery/discovery-data.ts app/api/opportunities/route.ts
git commit -m "feat: add status and deadline to opportunity interface and API"
```

---

### Task 5: Add Status Badge + Deadline to OpportunityCard

**Files:**
- Modify: `features/discovery/OpportunityCard.tsx` (import new constants, add badge + deadline UI)

- [ ] **Step 1: Update imports**

Replace the imports block (lines 7-12) in `features/discovery/OpportunityCard.tsx` with:

```typescript
import {
  TYPE_BADGE_CLASSES,
  TYPE_LABELS,
  SUBJECT_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from './discovery-data';
import type { Opportunity } from './discovery-data';
```

- [ ] **Step 2: Add status badge to the badges row**

In the badges `<div>` (lines 60-78), add the status badge after the subject badges. Replace the entire badges section with:

```tsx
      {/* Top: badges */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={cn(
              'rounded-md px-2.5 py-0.5 text-xs font-semibold',
              TYPE_BADGE_CLASSES[item.type] ?? TYPE_BADGE_CLASSES.OTHER,
            )}
          >
            {TYPE_LABELS[item.type] ?? item.type}
          </span>
          <span
            className={cn(
              'rounded-md px-2.5 py-0.5 text-xs font-semibold',
              STATUS_BADGE_CLASSES[item.status] ?? STATUS_BADGE_CLASSES.UNKNOWN,
            )}
          >
            {STATUS_LABELS[item.status] ?? 'Тодорхойгүй'}
          </span>
          {item.subjects.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-md bg-ds-tertiary/15 px-2.5 py-0.5 text-xs font-semibold text-ds-tertiary"
            >
              {SUBJECT_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      </div>
```

- [ ] **Step 3: Add deadline text below description**

After the description `<p>` block (lines 87-91), add the deadline display:

```tsx
      {/* Deadline */}
      {item.deadline && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-on-surface-variant">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Хугацаа: {new Date(item.deadline).toLocaleDateString('mn-MN')}
        </p>
      )}
```

- [ ] **Step 4: Run build to verify**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add features/discovery/OpportunityCard.tsx
git commit -m "feat: add status badge and deadline display to opportunity cards"
```

---

### Task 6: Update Existing Data + Add Migration Query to Scrape Routes

**Files:**
- Modify: `app/api/scrape/route.ts:18-22` (add migration query before scrape)
- Modify: `app/api/cron/scrape/route.ts:18-22` (same)

- [ ] **Step 1: Add migration query to POST scrape route**

In `app/api/scrape/route.ts`, add the migration queries right after the `try {` on line 18, before `const allItems = ...`:

```typescript
    // Update stale opportunity statuses before scraping new data
    await prisma.opportunity.updateMany({
      where: {
        deadline: { lt: new Date() },
        status: { not: 'EXPIRED' },
      },
      data: { status: 'EXPIRED' },
    });

    await prisma.opportunity.updateMany({
      where: {
        status: 'UNKNOWN',
        scrapedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      data: { status: 'EXPIRED' },
    });

    const allItems = await scrapeAllSites(sites);
```

- [ ] **Step 2: Add same migration query to GET cron scrape route**

In `app/api/cron/scrape/route.ts`, add the identical migration queries right after the `try {` on line 18, before `const allItems = ...`:

```typescript
    // Update stale opportunity statuses before scraping new data
    await prisma.opportunity.updateMany({
      where: {
        deadline: { lt: new Date() },
        status: { not: 'EXPIRED' },
      },
      data: { status: 'EXPIRED' },
    });

    await prisma.opportunity.updateMany({
      where: {
        status: 'UNKNOWN',
        scrapedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      data: { status: 'EXPIRED' },
    });

    const allItems = await scrapeAllSites(sites);
```

- [ ] **Step 3: Run build to verify**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add app/api/scrape/route.ts app/api/cron/scrape/route.ts
git commit -m "feat: update stale opportunity statuses before each scrape"
```

---

### Task 7: Re-scrape and Verify

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`

- [ ] **Step 2: Trigger a re-scrape via the discovery page**

Navigate to the discovery page and click "Мэдээ шинэчлэх" button. Verify the scrape completes without errors.

- [ ] **Step 3: Verify UI shows status badges and deadlines**

Check that:
- Opportunity cards show green "Идэвхтэй" or red "Хугацаа дууссан" badges
- Cards with deadlines display the date in Mongolian locale format
- No olympiad results or news recaps appear in the listings
- Only ACTIVE items are shown by default (API filters `status: 'ACTIVE'`)

- [ ] **Step 4: Run final build**

Run: `npm run build`
Expected: Clean build with no errors
