# Current Feature

Seed sample data — replace the mock-data-driven seed with a richer demo dataset: a hashed-password demo user, system item types with proper Lucide icons + colors, and 5 hand-curated collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) populated with realistic snippets, prompts, commands, and links. See [seed-spec.md](features/seed-spec.md).

## Status

In progress

## Goals

- Demo user: `demo@devstash.io` / "Demo User" / password `12345678` hashed with `bcryptjs` (12 rounds), `isPro: false`, `emailVerified` set to now
- 7 system `ItemType`s with `isSystem: true`, Lucide icon names, and hex colors from the spec
- 5 collections with descriptions per spec:
  - **React Patterns** — 3 TypeScript snippets (hooks, component patterns, utilities)
  - **AI Workflows** — 3 prompts (code review, doc generation, refactor assist)
  - **DevOps** — 1 snippet, 1 command, 2 links (real URLs)
  - **Terminal Commands** — 4 commands (git, docker, process management, package manager)
  - **Design Resources** — 4 links (real URLs for CSS/Tailwind, component libs, design systems, icon libs)
- Keep the seed idempotent (re-runnable via `npx prisma db seed`)
- Drop the dependency on `src/lib/mock-data.ts` for seeding now that real content lives in the seed itself

## Notes

- `bcryptjs` is a new dependency (pure JS — no native build step, works fine with `tsx`)
- Seed runs via `prisma.config.ts → migrations.seed = "tsx prisma/seed.ts"` (already configured)
- Item type `name` values in the spec are lowercase singular (`snippet`, `prompt`, …) — different from the existing plural Title Case in `mock-data.ts`; the dashboard sidebar will need its name source updated when wired to the DB
- Real URLs for DevOps / Design Resources should point to canonical docs (docs.docker.com, tailwindcss.com, ui.shadcn.com, lucide.dev, etc.) — no link rot from invented URLs

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-16 — Initial Next.js and Tailwind setup; stripped Create Next App boilerplate, added project context docs, pushed to `origin/main`.
- 2026-05-16 — Dashboard UI Phase 1 complete on branch `lesson-02-dashboard-phase-1`: initialized shadcn/ui (Button, Input), set dark mode as default in root layout, added `/dashboard` route with sidebar/main `<h2>` placeholders and a display-only top bar (search input with ⌘ K hint, New Collection, New Item).
- 2026-05-16 — Dashboard UI Phase 2 complete: collapsible `Sidebar` with `Types` section (item-type links to `/items/<name>`), `Collections` section split into Favorites and Most Recent, user avatar footer (initials + name + email + settings); `DashboardShell` client wrapper owns sidebar state; `TopBar` got a `PanelLeft` toggle; mobile renders as an overlay drawer with backdrop. Swapped Geist Sans for Poppins (`--font-poppins` wired into `--font-sans`/`--font-heading`); fixed stale Turbopack cache that was stripping `:root`/`.dark` theme vars and breaking dark mode.
- 2026-05-17 — Dashboard UI Phase 3 complete on branch `lesson-04-dashboard-phase-3`: built `DashboardMain` rendering 4 `StatsCards` (items / collections / favorite items / favorite collections), a `CollectionCard` grid, a `Pinned` section, and a `Recent Items` section (top 10 by `updatedAt`); shared `typeIconsBySlug` extracted to `src/lib/type-icons.ts`; hover state on interactive cards uses `hover:border-foreground/30`. Sidebar polish: mobile drawer auto-closes on link tap via `matchMedia`, `recentCollections` now actually sorted by `updatedAt` (added to `MockCollection`), `aria-label` moved from `<aside>` to inner `<nav>`, settings cog converted to a `Link`, and `SidebarSection` switched to native `<details>`/`<summary>` disclosure to drop `useState` + `aria-expanded`.
- 2026-05-17 — Prisma 7 + Neon Postgres setup complete on branch `lesson-05-database`: installed `prisma@7`, `@prisma/client@7`, `@prisma/adapter-pg`, `pg`, `dotenv`, `tsx`; bumped to Node 26 (Prisma 7 requires 22.12+) and pinned `engines.node >= 22.12`; switched `package.json` to `"type": "module"` and added `postinstall: prisma generate`. Schema at `prisma/schema.prisma` uses the new `prisma-client` generator with required `output = "../src/generated/prisma"` and a `url`-less datasource (Prisma 7 removed `url` from the datasource block — connection URL lives in `prisma.config.ts` instead, which also loads `dotenv/config`). Models: `User`, `Item`, `ItemType`, `Collection`, `Tag`, `ItemTag` plus NextAuth v5 (`Account`, `Session`, `VerificationToken`) with indexes on `userId` + `(userId, updatedAt)` / `(userId, isPinned)` / `(userId, isFavorite)` composites on `Item`, cascade deletes on user-owned tables, `Restrict` on `Item.type`, `SetNull` on `Item.collection`. Runtime client at `src/lib/prisma.ts` uses the required `PrismaPg` driver adapter (v7 has no built-in connectors) with a `globalThis` singleton for Next dev hot reload. Generated client gitignored at `src/generated/` and excluded from ESLint. Initial migration `20260517234848_init` applied to Neon dev branch; idempotent `prisma/seed.ts` (registered via `prisma.config.ts → migrations.seed`, not `package.json`) populated 1 user / 7 system ItemTypes / 6 collections / 6 items / 14 tags / 14 ItemTags from `src/lib/mock-data.ts`.
