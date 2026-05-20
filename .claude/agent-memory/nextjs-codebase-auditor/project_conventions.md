---
name: project-conventions
description: Key stack and coding conventions confirmed by reading the codebase during the first full audit (May 2026).
metadata:
  type: project
---

Confirmed conventions from the live codebase:

- Tailwind v4: CSS-based config only in `src/app/globals.css` via `@theme inline {}`. No `tailwind.config.ts` exists — correct.
- Prisma 7: `prisma-client` generator, client at `src/generated/prisma/`, singleton via `globalThis` in `src/lib/prisma.ts`. Connection URL in `prisma.config.ts`, not `schema.prisma`.
- `"type": "module"` in `package.json` — all files use ESM.
- Server Actions pattern: `{ success, data, error }` return shape (documented, not yet implemented in code — no actions exist yet).
- Server components by default; `'use client'` only in `DashboardShell` (sidebar state) and `Sidebar` (mobile close logic).
- DB query files live in `src/lib/db/[entity].ts`.
- Demo user lookup by `demo@devstash.io` is intentional temp pattern tracked in `DEMO_USER_EMAIL` constant, flagged for swap when NextAuth lands.
- `src/lib/mock-data.ts` was deleted; all data comes from real DB queries now.
- No Server Actions implemented yet — forms are display-only.
- No API routes exist yet.
- shadcn/ui components use Base UI (`@base-ui/react`) primitives, not Radix. This is the project's chosen variant.

**Why:** These are load-bearing decisions — don't flag them as issues in future audits.
**How to apply:** When scanning, verify against this list before flagging architecture or config choices as wrong.
