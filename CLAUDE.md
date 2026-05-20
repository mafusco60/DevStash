# Devstash

A developper knowldege hub for snippets, commands, prompts, notes, files, images, links, and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)

## Neon MCP Usage

When using any `mcp__neon__*` tool in this project:

- **Project**: `devstash` (id: `wandering-lake-64838978`)
- **Default branch**: always pass `branchId: "br-withered-tooth-apihj818"` (the `development` branch)
- **Production branch**: `br-ancient-art-ap7v54nk` — NEVER target this branch unless I explicitly say "production" or name the branch. This applies to reads as well as any write operation (schema changes, data edits, migrations, branch deletes, etc.).
- If a request is ambiguous about which branch to use, ask before running.
- Do not call `list_projects` to rediscover the project — use the IDs above directly.
