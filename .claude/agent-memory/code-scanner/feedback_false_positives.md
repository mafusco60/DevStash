---
name: false-positives-to-avoid
description: Patterns confirmed as intentional in DevStash — never flag these in audits.
metadata:
  type: feedback
---

Do NOT flag:
- `.env` exposure — `.env*` is in `.gitignore`. Verified.
- `demo@devstash.io` hardcoded lookup — known temp pattern, tracked for NextAuth swap.
- Missing auth/session checks — auth not yet implemented, deferred per roadmap.
- `src/generated/prisma/` — gitignored, ESLint-excluded, regenerated artifact.
- Base UI primitives in shadcn components — intentional choice, not an error.
- No `tailwind.config.ts` — correct for Tailwind v4, config is in `globals.css`.
- Display-only forms (TopBar search, New buttons) — Server Actions not yet wired up.

**Why:** All confirmed intentional after reading actual code and project docs.
**How to apply:** Run through before finalizing any report.
