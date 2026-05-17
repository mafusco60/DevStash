# Current Feature

Dashboard UI Phase 3 — build out the main area: 4 stats cards, recent collections, pinned items, and 10 most recent items. See [dashboard-phase-3-spec.md](features/dashboard-phase-3-spec.md).

## Status

In progress

## Goals

- 4 stats cards at the top: total items, collections, favorite items, favorite collections
- Recent collections section
- Pinned items section
- 10 most recent items section

## Notes

- Reference screenshot: [dashboard-ui-main.png](screenshots/dashboard-ui-main.png)
- Mock data available at [src/lib/mock-data.ts](../src/lib/mock-data.ts) — import directly until DB is wired up
- Phase 1 spec: [dashboard-phase-1-spec.md](features/dashboard-phase-1-spec.md)
- Phase 2 spec: [dashboard-phase-2-spec.md](features/dashboard-phase-2-spec.md)

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-16 — Initial Next.js and Tailwind setup; stripped Create Next App boilerplate, added project context docs, pushed to `origin/main`.
- 2026-05-16 — Dashboard UI Phase 1 complete on branch `lesson-02-dashboard-phase-1`: initialized shadcn/ui (Button, Input), set dark mode as default in root layout, added `/dashboard` route with sidebar/main `<h2>` placeholders and a display-only top bar (search input with ⌘ K hint, New Collection, New Item).
- 2026-05-16 — Dashboard UI Phase 2 complete: collapsible `Sidebar` with `Types` section (item-type links to `/items/<name>`), `Collections` section split into Favorites and Most Recent, user avatar footer (initials + name + email + settings); `DashboardShell` client wrapper owns sidebar state; `TopBar` got a `PanelLeft` toggle; mobile renders as an overlay drawer with backdrop. Swapped Geist Sans for Poppins (`--font-poppins` wired into `--font-sans`/`--font-heading`); fixed stale Turbopack cache that was stripping `:root`/`.dark` theme vars and breaking dark mode.
