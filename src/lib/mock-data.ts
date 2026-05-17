export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  slug: "snippet" | "prompt" | "command" | "note" | "file" | "image" | "url";
  icon: string;
  count: number;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isFavorite: boolean;
  itemTypeSlugs: MockItemType["slug"][];
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  typeSlug: MockItemType["slug"];
  collectionId: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  language?: string;
  updatedAt: string;
}

export const mockUser: MockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  isPro: false,
};

export const mockItemTypes: MockItemType[] = [
  { id: "type_snippet", name: "Snippets", slug: "snippet", icon: "code", count: 24 },
  { id: "type_prompt", name: "Prompts", slug: "prompt", icon: "sparkles", count: 18 },
  { id: "type_command", name: "Commands", slug: "command", icon: "terminal", count: 15 },
  { id: "type_note", name: "Notes", slug: "note", icon: "file-text", count: 12 },
  { id: "type_file", name: "Files", slug: "file", icon: "file", count: 5 },
  { id: "type_image", name: "Images", slug: "image", icon: "image", count: 3 },
  { id: "type_url", name: "Links", slug: "url", icon: "link", count: 8 },
];

export const mockCollections: MockCollection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    isFavorite: true,
    itemTypeSlugs: ["snippet", "note", "url"],
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    isFavorite: false,
    itemTypeSlugs: ["snippet", "file"],
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    isFavorite: true,
    itemTypeSlugs: ["file", "note"],
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    isFavorite: false,
    itemTypeSlugs: ["note", "snippet", "url", "prompt"],
  },
  {
    id: "col_git_commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    isFavorite: true,
    itemTypeSlugs: ["command", "note"],
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    isFavorite: false,
    itemTypeSlugs: ["prompt", "snippet", "note"],
  },
];

export const mockItems: MockItem[] = [
  {
    id: "item_use_auth_hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeSlug: "snippet",
    collectionId: "col_react_patterns",
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    language: "typescript",
    updatedAt: "2026-01-15",
  },
  {
    id: "item_api_error_handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeSlug: "snippet",
    collectionId: "col_react_patterns",
    tags: ["api", "error-handling", "fetch"],
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    updatedAt: "2026-01-12",
  },
  {
    id: "item_git_rebase_interactive",
    title: "Interactive Rebase Cheatsheet",
    description: "Commands for rewriting git history safely",
    typeSlug: "command",
    collectionId: "col_git_commands",
    tags: ["git", "rebase"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-10",
  },
  {
    id: "item_code_review_prompt",
    title: "Code Review Prompt",
    description: "AI prompt for thorough code review feedback",
    typeSlug: "prompt",
    collectionId: "col_ai_prompts",
    tags: ["ai", "review"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-01-08",
  },
  {
    id: "item_python_decorators",
    title: "Common Python Decorators",
    description: "Reusable decorators for caching, timing, and logging",
    typeSlug: "snippet",
    collectionId: "col_python_snippets",
    tags: ["python", "decorators"],
    isFavorite: false,
    isPinned: false,
    language: "python",
    updatedAt: "2026-01-05",
  },
  {
    id: "item_nextjs_context",
    title: "Next.js App Router Context",
    description: "Context file describing the App Router conventions",
    typeSlug: "file",
    collectionId: "col_context_files",
    tags: ["nextjs", "context"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-03",
  },
];
