---
name: audit-may-2026
description: First full codebase scan summary from May 2026 — references confirmed findings by file and severity.
metadata:
  type: project
---

Audit completed 2026-05-19 covering all code through the sidebar PRO badge feature (commit 7350691).

Top hotspots to recheck in future scans:
- `src/components/dashboard/DashboardMain.tsx:14` — duplicate user lookup (should be resolved by auth swap)
- `src/lib/db/collections.ts:99` — `getSidebarCollections` has no `take` limit
- `src/lib/prisma.ts:11` — `DATABASE_URL!` assertion without guard
- `src/lib/type-icons.ts:16` — `Record<string, IconComponent>` hides undefined access
- `src/components/dashboard/TopBar.tsx` — receives function prop but has no `'use client'` directive

**Why:** These were real findings from the first audit — quick to recheck on future scans.
**How to apply:** Start re-audits by spot-checking these lines before doing a full pass.
