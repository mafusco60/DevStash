import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEMO_USER = {
  id: "user_demo",
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
  isPro: false,
};

const ITEM_TYPES = [
  { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "command", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "file", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "image", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "link", icon: "Link", color: "#10b981" },
] as const;

interface SeedItem {
  id: string;
  title: string;
  description: string;
  typeId: (typeof ITEM_TYPES)[number]["id"];
  contentType: "text" | "file";
  content?: string;
  url?: string;
  language?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

interface SeedCollection {
  id: string;
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

const COLLECTIONS: SeedCollection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        id: "item_use_debounce",
        title: "useDebounce hook",
        description: "Debounce a value across renders",
        typeId: "type_snippet",
        contentType: "text",
        language: "typescript",
        isPinned: true,
        isFavorite: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        id: "item_context_provider",
        title: "Typed Context provider",
        description: "Strictly-typed React Context with a guarded consumer hook",
        typeId: "type_snippet",
        contentType: "text",
        language: "typescript",
        content: `import { createContext, useContext, type ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ThemeContextValue;
}) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}`,
      },
      {
        id: "item_cn_util",
        title: "cn() class name utility",
        description: "Merge Tailwind classes with conflict resolution",
        typeId: "type_snippet",
        contentType: "text",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
  },
  {
    id: "col_ai_workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        id: "item_code_review_prompt",
        title: "Code review prompt",
        description: "Honest, prioritized review with file:line labels",
        typeId: "type_prompt",
        contentType: "text",
        isFavorite: true,
        isPinned: true,
        content: `Review the following diff. Label each issue as BLOCKING, NIT, or QUESTION and include file:line.
Focus on: correctness, edge cases, security, and patterns that contradict the existing codebase conventions.
Skip style nits already enforced by the linter. Skip praise — only report what needs attention.

<diff>
{paste diff here}
</diff>`,
      },
      {
        id: "item_doc_gen_prompt",
        title: "Documentation generation",
        description: "Generate concise README sections from source",
        typeId: "type_prompt",
        contentType: "text",
        content: `Given the source file below, produce a README section with: a one-line summary, a usage example using realistic data, and a table of every exported function with its parameters and return type.
Match the existing voice of the surrounding docs (terse, no marketing). Do not invent behavior that's not in the source.

<source>
{paste source here}
</source>`,
      },
      {
        id: "item_refactor_prompt",
        title: "Refactor assistance",
        description: "Single highest-leverage refactor with rationale and rollback",
        typeId: "type_prompt",
        contentType: "text",
        content: `Suggest the single highest-leverage refactor for the file below. Output:
1. Diagnosis — what currently makes the code hard to change.
2. Proposal — the diff (unified format) for the refactor.
3. Rationale — what gets easier and what stays the same.
4. Rollback — how to revert if the new design doesn't pan out.

If the file is already well-factored, say so explicitly and stop.

<file>
{paste file here}
</file>`,
      },
    ],
  },
  {
    id: "col_devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        id: "item_dockerfile_next",
        title: "Multi-stage Next.js Dockerfile",
        description: "Production image using Next's standalone output",
        typeId: "type_snippet",
        contentType: "text",
        language: "dockerfile",
        content: `# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        id: "item_deploy_vercel",
        title: "Vercel deploy from CI",
        description: "Promote a prebuilt production deploy via the Vercel CLI",
        typeId: "type_command",
        contentType: "text",
        language: "bash",
        content: `vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
vercel build --prod --token="$VERCEL_TOKEN"
vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"`,
      },
      {
        id: "item_link_docker_docs",
        title: "Docker documentation",
        description: "Official docs — Dockerfile reference, compose, BuildKit",
        typeId: "type_link",
        contentType: "text",
        url: "https://docs.docker.com",
      },
      {
        id: "item_link_gha_docs",
        title: "GitHub Actions documentation",
        description: "Workflow syntax, contexts, marketplace actions",
        typeId: "type_link",
        contentType: "text",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    id: "col_terminal_commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
    items: [
      {
        id: "item_git_undo_commit",
        title: "Undo last commit, keep changes",
        description: "Soft-reset so the diff stays staged",
        typeId: "type_command",
        contentType: "text",
        language: "bash",
        content: `git reset --soft HEAD~1`,
      },
      {
        id: "item_docker_prune",
        title: "Reclaim disk from Docker",
        description: "Remove stopped containers, unused images, networks, and build cache",
        typeId: "type_command",
        contentType: "text",
        language: "bash",
        content: `docker system prune -af --volumes`,
      },
      {
        id: "item_kill_port",
        title: "Kill whatever's bound to a port",
        description: "Find and terminate the process listening on a TCP port",
        typeId: "type_command",
        contentType: "text",
        language: "bash",
        content: `lsof -ti:3000 | xargs -r kill -9`,
      },
      {
        id: "item_npm_outdated",
        title: "List outdated npm dependencies",
        description: "Show current / wanted / latest versions for every package",
        typeId: "type_command",
        contentType: "text",
        language: "bash",
        content: `npm outdated --long`,
      },
    ],
  },
  {
    id: "col_design_resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        id: "item_link_tailwind",
        title: "Tailwind CSS docs",
        description: "Utility class reference and configuration guides",
        typeId: "type_link",
        contentType: "text",
        url: "https://tailwindcss.com/docs",
      },
      {
        id: "item_link_shadcn",
        title: "shadcn/ui",
        description: "Copy-paste component library built on Radix + Tailwind",
        typeId: "type_link",
        contentType: "text",
        url: "https://ui.shadcn.com",
      },
      {
        id: "item_link_material",
        title: "Material Design 3",
        description: "Google's design system — tokens, typography, motion principles",
        typeId: "type_link",
        contentType: "text",
        url: "https://m3.material.io",
      },
      {
        id: "item_link_lucide",
        title: "Lucide icons",
        description: "Open-source icon set used throughout this app",
        typeId: "type_link",
        contentType: "text",
        url: "https://lucide.dev",
      },
    ],
  },
];

async function main() {
  console.log("Hashing demo password (bcryptjs, 12 rounds)…");
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);

  // Wipe data owned by users we manage in this seed so re-runs produce a
  // deterministic state. Cascades clear collections / items / tags / sessions.
  console.log("Clearing previous demo seed (if any)…");
  await prisma.user.deleteMany({
    where: { email: { in: [DEMO_USER.email, "john@example.com"] } },
  });
  await prisma.itemType.deleteMany({
    where: {
      AND: [{ isSystem: true }, { id: { notIn: ITEM_TYPES.map((t) => t.id) } }],
    },
  });

  console.log(`Seeding ${ITEM_TYPES.length} system ItemTypes…`);
  for (const type of ITEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: {
        name: type.name,
        icon: type.icon,
        color: type.color,
        isSystem: true,
      },
      create: {
        id: type.id,
        name: type.name,
        icon: type.icon,
        color: type.color,
        isSystem: true,
      },
    });
  }

  console.log(`Creating demo user (${DEMO_USER.email})…`);
  const user = await prisma.user.create({
    data: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password: passwordHash,
      isPro: DEMO_USER.isPro,
      emailVerified: new Date(),
    },
  });

  console.log(`Creating ${COLLECTIONS.length} collections and items…`);
  for (const collection of COLLECTIONS) {
    await prisma.collection.create({
      data: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite ?? false,
        userId: user.id,
        items: {
          create: collection.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            contentType: item.contentType,
            content: item.content,
            url: item.url,
            language: item.language,
            isFavorite: item.isFavorite ?? false,
            isPinned: item.isPinned ?? false,
            userId: user.id,
            typeId: item.typeId,
          })),
        },
      },
    });
  }

  const totalItems = COLLECTIONS.reduce((sum, c) => sum + c.items.length, 0);
  console.log(
    `Seed complete: 1 user, ${ITEM_TYPES.length} item types, ${COLLECTIONS.length} collections, ${totalItems} items.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
