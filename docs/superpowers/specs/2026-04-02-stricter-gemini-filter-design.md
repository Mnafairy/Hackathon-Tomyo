# Stricter Gemini Filter + Status Badges — Design Spec

**Date**: 2026-04-02
**Context**: Scraped items include non-opportunities (olympiad results, news recaps). Expired opportunities are saved but not visually distinguished. No deadline visibility on cards.

## Scope

1. Stricter Gemini prompt with confidence scoring
2. Post-Gemini keyword safety net filter
3. Status resolution + existing data update
4. UI status badge + deadline on OpportunityCard
5. Re-scrape after deployment

---

## 1. Stricter Gemini Prompt

**Current prompt** already has KEEP/REJECT rules and outputs type, subjects, age, deadline, status. Enhancements:

### Add confidence field
Gemini must rate 1-5 how confident it is that the item is an **actionable** opportunity students can apply/register for. Only items with `confidence >= 3` pass post-processing.

Output shape:
```json
{
  "index": 0,
  "type": "COMPETITION",
  "subjects": ["MATHEMATICS"],
  "minAge": 14,
  "maxAge": 18,
  "deadline": "2026-05-15",
  "status": "ACTIVE",
  "confidence": 4
}
```

### Stronger REJECT examples
Add explicit Mongolian keywords to the REJECT section:
- Results: "дүн", "үр дүн", "шалгарлаа", "шалгаруулав", "байр эзэлсэн"
- Recaps: "амжилттай болж өндөрлөлөө", "зохион байгуулагдлаа", "болж өнгөрлөө"
- Awards given: "шагнал гардуулав", "гардуулах ёслол"
- Distinguish: "Олимпиадын бүртгэл эхэллээ" (KEEP) vs "Олимпиадын дүн гарлаа" (REJECT)

---

## 2. Post-Gemini Keyword Filter

A programmatic safety net applied after Gemini classification. Catches items Gemini missed.

### REJECT_KEYWORDS list
```typescript
const REJECT_PATTERNS = [
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
```

Applied to `title + " " + description`. If any pattern matches, the item is excluded from the final classified output.

---

## 3. Status Resolution + Existing Data Update

### Enhanced resolveStatus()
- If `deadline < now()`, **always** return `EXPIRED` regardless of Gemini's assessment
- If `deadline > now()`, **always** return `ACTIVE`
- If no deadline, trust Gemini's status

### Existing data migration
Run once after deployment:
- `UPDATE opportunities SET status = 'EXPIRED' WHERE deadline < NOW()`
- `UPDATE opportunities SET status = 'EXPIRED' WHERE status = 'UNKNOWN' AND "scrapedAt" < NOW() - INTERVAL '30 days'`

Implemented as a Prisma `updateMany` call in the scrape route (runs before new scrape).

---

## 4. UI: Status Badge + Deadline on OpportunityCard

### Changes to Opportunity type
Add `status` and `deadline` to the `Opportunity` interface in `discovery-data.ts`.

### Changes to API response
Include `status` and `deadline` in the opportunities API response mapping.

### OpportunityCard visual changes
- **Green badge**: "Идэвхтэй" for `ACTIVE` — `bg-green-500/15 text-green-600`
- **Red badge**: "Хугацаа дууссан" for `EXPIRED` — `bg-red-500/15 text-red-600`
- **Gray badge**: "Тодорхойгүй" for `UNKNOWN` — `bg-gray-500/15 text-gray-500`
- **Deadline text**: "Хугацаа: 2026-05-15" shown below the description, formatted as localized date
- Both badge and date shown on every card

---

## 5. Re-scrape Flow

After deploying all changes:
1. Update existing expired opportunities (migration query from section 3)
2. Trigger re-scrape via "Мэдээ шинэчлэх" button or API
3. New items go through stricter Gemini prompt + keyword filter
4. Only high-confidence actionable opportunities saved as ACTIVE

---

## Files Changed

| File | Change |
|------|--------|
| `lib/gemini-filter.ts` | Stricter prompt, confidence field, REJECT_PATTERNS post-filter |
| `features/discovery/discovery-data.ts` | Add `status`, `deadline` to Opportunity interface |
| `features/discovery/OpportunityCard.tsx` | Status badge + deadline display |
| `app/api/opportunities/route.ts` | Include `status`, `deadline` in response |
| `app/api/scrape/route.ts` | Run migration query before scrape |
| `app/api/cron/scrape/route.ts` | Same migration query |
