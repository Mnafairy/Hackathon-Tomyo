# Demo-Safe Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 5 production-readiness issues (missing middleware, error boundary, loading skeletons, unprotected APIs) so the app is demo-safe for a hackathon presentation.

**Architecture:** Add a Next.js middleware for centralized auth, a root error boundary, two loading skeletons, and auth guards on 3 API routes. All changes are additive — no existing behavior changes.

**Tech Stack:** Next.js 16, NextAuth 4, shadcn/ui Skeleton, TypeScript

---

## File Structure

```
middleware.ts                              # CREATE: centralized route protection
app/error.tsx                              # CREATE: root error boundary (client component)
app/(shop)/discovery/[id]/loading.tsx      # CREATE: detail page skeleton
app/(shop)/saved/loading.tsx               # CREATE: saved page skeleton
app/api/scrape/route.ts                    # MODIFY: add CRON_SECRET auth guard
app/api/chat/route.ts                      # MODIFY: add NextAuth session guard
app/api/translate/route.ts                 # MODIFY: add NextAuth session guard
```

---

### Task 1: Create `middleware.ts` — Route Protection

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create the middleware file**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = ['/saved', '/profile', '/post-project'];
const ADMIN_PATHS = ['/admin'];

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAdmin) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/saved/:path*', '/profile/:path*', '/post-project/:path*', '/admin/:path*'],
};
```

- [ ] **Step 2: Update auth.ts JWT callback to include role**

The middleware checks `token.role`, so the JWT callback must include it. Modify `lib/auth.ts` — in the `jwt` callback, after `token.sub = user.id`, fetch the user's role and attach it:

```ts
async jwt({ token, user }) {
  if (user) {
    token.sub = user.id;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    token.role = dbUser?.role ?? 'USER';
  }
  return token;
},
```

Also add the type augmentation for the JWT token at the top of `lib/auth.ts`:

```ts
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
```

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts lib/auth.ts
git commit -m "feat: add middleware for centralized route protection"
```

---

### Task 2: Create `app/error.tsx` — Root Error Boundary

**Files:**
- Create: `app/error.tsx`

- [ ] **Step 1: Create the error boundary**

```tsx
'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="glass-panel animate-fade-up mx-auto max-w-md rounded-2xl p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ds-error/10">
          <svg
            className="h-8 w-8 text-ds-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold text-on-surface">Алдаа гарлаа</h2>
        <p className="mb-6 text-sm text-on-surface-variant">
          Уучлаарай, ямар нэгэн алдаа гарлаа. Дахин оролдоно уу.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2.5 text-sm font-semibold text-on-primary-fixed transition-shadow hover:shadow-lg hover:shadow-ds-primary/20"
          >
            Дахин оролдох
          </button>
          <Link
            href="/"
            className="rounded-full border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/error.tsx
git commit -m "feat: add root error boundary with Mongolian UI"
```

---

### Task 3: Create Loading Skeletons

**Files:**
- Create: `app/(shop)/discovery/[id]/loading.tsx`
- Create: `app/(shop)/saved/loading.tsx`

- [ ] **Step 1: Create the opportunity detail loading skeleton**

Create `app/(shop)/discovery/[id]/loading.tsx`:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function DetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="glass-panel animate-fade-up rounded-2xl p-8">
        {/* Type badge + subject badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="mb-6 h-8 w-1/2" />

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

        {/* Description lines */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Metadata grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>

        {/* CTA button */}
        <Skeleton className="mt-8 h-12 w-48 rounded-full" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the saved page loading skeleton**

Create `app/(shop)/saved/loading.tsx`:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-3 h-1 w-12" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-1 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-2/3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/\(shop\)/discovery/\[id\]/loading.tsx app/\(shop\)/saved/loading.tsx
git commit -m "feat: add loading skeletons for detail and saved pages"
```

---

### Task 4: Protect `/api/scrape` with CRON_SECRET

**Files:**
- Modify: `app/api/scrape/route.ts`

- [ ] **Step 1: Add auth guard at the top of the POST handler**

Add the same bearer token check used in `/api/cron/scrape/route.ts`. Insert at the very beginning of the `POST` function, before any other logic:

```ts
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... rest of existing function unchanged
```

Note: The function signature changes from `POST()` to `POST(req: Request)` to access headers. Also add `Request` import usage — `NextResponse` is already imported.

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/scrape/route.ts
git commit -m "fix: protect /api/scrape with CRON_SECRET auth"
```

---

### Task 5: Protect `/api/chat` with NextAuth Session

**Files:**
- Modify: `app/api/chat/route.ts`

- [ ] **Step 1: Add session check and remove incorrect "use server" directive**

The file currently has `"use server"` which is incorrect for an API route. Remove it and add session auth:

Replace the full file content with:

```ts
import { getServerSession } from 'next-auth';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const groundingTool = {
  googleSearch: {},
};

const config = {
  tools: [groundingTool],
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config,
    });
    const reply = response.text;
    return NextResponse.json({ reply });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "fix: protect /api/chat with session auth, remove incorrect use server"
```

---

### Task 6: Protect `/api/translate` with NextAuth Session

**Files:**
- Modify: `app/api/translate/route.ts`

- [ ] **Step 1: Add session check at the top of the POST handler**

Add the session check after imports, at the very beginning of the `POST` function:

```ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { translateOpportunity } from '@/lib/gemini-translate';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 });
  }

  try {
    const { opportunityId, targetLang } = await req.json();

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId required' },
        { status: 400 },
      );
    }

    const result = await translateOpportunity(
      opportunityId,
      targetLang ?? 'mn',
    );
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/translate/route.ts
git commit -m "fix: protect /api/translate with session auth"
```

---

## Final Verification

- [ ] **Run full build**: `npm run build` — must pass with 0 errors
- [ ] **Verify route count**: Should still show 22 routes (4 new files are loading/error, not new routes)
- [ ] **Test middleware**: Visit `/saved` without being logged in — should redirect to `/login?callbackUrl=/saved`
