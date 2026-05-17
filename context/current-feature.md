# Current Feature

_None — ready for the next phase._

## Status

## Goals

## Notes

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-16 — Initial Next.js and Tailwind setup; stripped Create Next App boilerplate, added project context docs, pushed to `origin/main`.
- 2026-05-16 — Dashboard UI Phase 1 complete on branch `lesson-02-dashboard-phase-1`: initialized shadcn/ui (Button, Input), set dark mode as default in root layout, added `/dashboard` route with sidebar/main `<h2>` placeholders and a display-only top bar (search input with ⌘ K hint, New Collection, New Item).
- 2026-05-16 — Dashboard UI Phase 2 complete: collapsible `Sidebar` with `Types` section (item-type links to `/items/<name>`), `Collections` section split into Favorites and Most Recent, user avatar footer (initials + name + email + settings); `DashboardShell` client wrapper owns sidebar state; `TopBar` got a `PanelLeft` toggle; mobile renders as an overlay drawer with backdrop. Swapped Geist Sans for Poppins (`--font-poppins` wired into `--font-sans`/`--font-heading`); fixed stale Turbopack cache that was stripping `:root`/`.dark` theme vars and breaking dark mode.
