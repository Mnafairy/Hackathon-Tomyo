# Demo-Safe Hardening — Design Spec

**Date**: 2026-04-02
**Context**: Hackathon demo preparation — fix issues that could break during a live demo or look unprofessional.

## Scope

5 changes. No community backend, no rate limiting, no per-route error boundaries.

---

## 1. `middleware.ts` — Route Protection

**Problem**: Auth checks are scattered across routes using mixed patterns (server `getServerSession`, client `useSession`, JWT `getToken`). Client-side redirects in `/profile` and `/post-project` flash protected content before redirecting.

**Solution**: Add `middleware.ts` at project root.

- Check for NextAuth session token (`next-auth.session-token` cookie) on protected routes
- Protected paths: `/saved`, `/profile`, `/post-project`, `/admin/*`
- Redirect unauthenticated users to `/login` server-side
- Admin routes (`/admin/*`) additionally verify admin role via JWT token
- Public routes pass through: `/`, `/discovery`, `/community`, `/login`, `/api/*`
- Use `NextResponse.redirect()` for clean server-side redirects
- Export `config.matcher` to limit middleware to relevant paths only

**Files**: `middleware.ts` (new)

---

## 2. `error.tsx` — Root Error Boundary

**Problem**: No error.tsx files exist. Runtime errors show raw Next.js error UI.

**Solution**: Add a single `app/error.tsx` client component.

- Mongolian error message: "Алдаа гарлаа"
- "Дахин оролдох" button calling `reset()`
- "Нүүр хуудас" link to `/`
- Matches app's dark theme and design language
- One root-level file covers all routes for a demo

**Files**: `app/error.tsx` (new)

---

## 3. `loading.tsx` — Skeleton Loaders

**Problem**: No loading states for dynamic routes. Pages appear blank while data loads.

**Solution**: Add loading.tsx for the two dynamic routes judges will likely visit.

- `app/(shop)/discovery/[id]/loading.tsx` — Skeleton matching opportunity detail layout (title, description lines, metadata badges)
- `app/(shop)/saved/loading.tsx` — Skeleton matching saved opportunities grid (card placeholders)
- Use shadcn/ui `Skeleton` component
- Match existing page structure so the transition feels seamless

**Files**: `app/(shop)/discovery/[id]/loading.tsx` (new), `app/(shop)/saved/loading.tsx` (new)

---

## 4. Community Page — Keep As-Is

No changes. The existing mock UI stays.

---

## 5. Protect Expensive API Routes

**Problem**: `/api/scrape`, `/api/chat`, `/api/translate` have no auth. Anyone can hit the Gemini API key.

**Solution**: Add auth guards to each.

- `/api/scrape` — Require `CRON_SECRET` bearer token (matches existing `/api/cron/scrape` pattern)
- `/api/chat` — Require NextAuth session via `getServerSession(authOptions)`, return 401 if missing
- `/api/translate` — Require NextAuth session via `getServerSession(authOptions)`, return 401 if missing

**Files**: `app/api/scrape/route.ts` (edit), `app/api/chat/route.ts` (edit), `app/api/translate/route.ts` (edit)

---

## Summary of Changes

| Change | New Files | Edited Files |
|--------|-----------|-------------|
| middleware.ts | 1 | 0 |
| error.tsx | 1 | 0 |
| loading.tsx | 2 | 0 |
| API auth guards | 0 | 3 |
| **Total** | **4 new** | **3 edited** |
