---
name: false-positives-to-avoid
description: Patterns that look like issues but are intentional in this codebase — do not flag these in future audits.
metadata:
  type: feedback
---

Do NOT flag these as issues:

1. **`.env` not in `.gitignore`** — `.env*` IS in `.gitignore` (line 34: `.env*`, with `!.env.example` exception). Verified.

2. **`demo@devstash.io` hardcoded user lookup** — This is a known, tracked temporary pattern (`DEMO_USER_EMAIL` constant in both `dashboard/page.tsx` and `DashboardMain.tsx`). Will be replaced when NextAuth lands. Tracked in project memory [[project_nextauth_dashboard_swap]].

3. **Missing auth checks** — Auth has not been implemented yet. Do not flag unprotected routes or missing session checks.

4. **`src/generated/prisma/`** — Intentionally gitignored and ESLint-excluded. Regenerated via `prisma generate`. Never audit or flag.

5. **shadcn components using `@base-ui/react`** — This project uses Base UI primitives (`useRender`, `mergeProps`) for shadcn components instead of Radix. This is intentional.

6. **No Server Actions yet** — Forms (TopBar search, New Item/Collection buttons) are display-only. Feature not yet implemented.

7. **`tailwind.config.ts` absence** — This is correct for Tailwind v4. Config lives in `globals.css` `@theme` block.

**Why:** These all generated false positives or would generate them — saving here so future scans skip them.
**How to apply:** Run through this list before finalizing any audit report.
