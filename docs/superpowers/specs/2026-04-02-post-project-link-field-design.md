# Post-Project Link Field — Design Spec

**Date**: 2026-04-02
**Context**: User-submitted opportunities have no external link field. The `originalUrl` gets a placeholder `user-${timestamp}`, making the card's "Дэлгэрэнгүй" link broken.

## Scope

Add an optional URL field to the post-project form, wire it through the API, and conditionally render external links on opportunity cards.

---

## 1. Form Change — ProjectForm.tsx

Add an optional "Холбоос" (Link) text input after the description textarea.

- Label: "Холбоос (заавал биш)"
- Placeholder: "https://example.com/apply"
- Validation: if provided, must start with `http://` or `https://`. Show inline error "Зөв холбоос оруулна уу" if invalid.
- Pass value up to the parent page component alongside title, description, type, subjects.

---

## 2. API Change — POST /api/opportunities

Accept `originalUrl` from the request body.

- If provided and starts with `http://` or `https://`, use it as `originalUrl`
- If empty or not provided, fall back to `user-${Date.now()}`
- The `originalUrl` field has a `@unique` constraint in Prisma, so user-provided URLs will also prevent duplicate submissions for the same link

---

## 3. Card Change — OpportunityCard.tsx

Conditionally render the external link behavior:

- If `originalUrl` starts with `http`, render the card as an `<a>` linking externally with "Дэлгэрэнгүй" arrow
- If `originalUrl` starts with `user-`, render the card without an external link (just show info, no arrow, link to detail page instead if one exists, or just be a static card)

---

## Files Changed

| File | Change |
|------|--------|
| `features/post-project/ProjectForm.tsx` | Add optional URL input field with validation |
| `app/(shop)/post-project/page.tsx` | Pass URL state to form and include in API submission |
| `app/api/opportunities/route.ts` | Accept `originalUrl` from body |
| `features/discovery/OpportunityCard.tsx` | Conditionally show external link |
