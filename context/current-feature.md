# Current Feature

Dashboard UI Phase 1 — scaffold the dashboard route with shadcn/ui, dark mode default, top bar (search + new item, display only), and sidebar/main placeholders. See [dashboard-phase-1-spec.md](features/dashboard-phase-1-spec.md).

## Status

Completed

## Goals

- Initialize shadcn/ui and install required components
- Create the `/dashboard` route
- Build the main dashboard layout and global styles
- Default to dark mode
- Top bar with search input and "New Item" button (display only)
- Placeholder sidebar and main area (`<h2>` reading "Sidebar" / "Main")

## Notes

- Reference screenshot: [dashboard-ui-main.png](screenshots/dashboard-ui-main.png)
- Mock data available at [src/lib/mock-data.ts](../src/lib/mock-data.ts) (not wired up in phase 1)
- Phase 2 spec: [dashboard-phase-2-spec.md](features/dashboard-phase-2-spec.md)
- Phase 3 spec: [dashboard-phase-3-spec.md](features/dashboard-phase-3-spec.md)

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-16 — Initial Next.js and Tailwind setup; stripped Create Next App boilerplate, added project context docs, pushed to `origin/main`.
- 2026-05-16 — Dashboard UI Phase 1 complete on branch `lesson-02-dashboard-phase-1`: initialized shadcn/ui (Button, Input), set dark mode as default in root layout, added `/dashboard` route with sidebar/main `<h2>` placeholders and a display-only top bar (search input with ⌘ K hint, New Collection, New Item).
