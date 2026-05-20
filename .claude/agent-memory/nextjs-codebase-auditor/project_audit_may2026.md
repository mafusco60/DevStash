---
name: audit-may-2026
description: First full codebase audit findings summary from May 2026 — severities and file references for recurring hotspots.
metadata:
  type: project
---

First comprehensive audit run on 2026-05-19 covering all files through the sidebar PRO badge feature.

Key findings:

**High severity:**
- Duplicate `DEMO_USER_EMAIL` lookup: `src/app/dashboard/page.tsx` AND `src/components/dashboard/DashboardMain.tsx` both independently query the demo user — two extra DB round-trips per dashboard load. Fix: resolve user once in `page.tsx`, pass userId prop to `DashboardMain`.
- `getSidebarCollections` fetches ALL user collections without a limit (no `take`), then filters in memory. Could be expensive when user has many collections.

**Medium severity:**
- `DATABASE_URL!` non-null assertion in `src/lib/prisma.ts` crashes at runtime with an unhelpful error if env var is missing; wrap with an explicit guard.
- `src/app/dashboard/page.tsx` uses `export const dynamic = "force-dynamic"` which disables all caching; should be revisited once caching strategy is decided.
- `tsconfig.json` excludes only `node_modules`, so `src/generated/prisma/` is included in TypeScript compilation — adds compile-time overhead and could cause issues.
- `TopBar` is a server component but receives `onToggleSidebar` (a function prop) — works because `DashboardShell` is `'use client'` and renders it, but `TopBar` itself has no `'use client'` directive while accepting a callback prop, which is technically passing a non-serializable prop across a server/client boundary.

**Low severity:**
- `formatDate` in `ItemRow.tsx` doesn't account for year — items from last year show identical dates with no year disambiguation.
- `iconsByLucideName` is typed as `Record<string, IconComponent>` — accessing a key not in the map silently returns `undefined`, but the type says it won't. Should be `Partial<Record<...>>` or use a lookup helper.
- `scripts/test-db.ts` does multiple sequential `prisma.*` count queries that could be parallelized (this is a dev script, low priority).

**Why:** Tracking so re-audits can quickly check if these were resolved without re-reading all files.
**How to apply:** On next audit, verify these specific files/patterns first before full re-scan.
