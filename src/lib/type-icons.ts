import type { ComponentType, SVGProps } from "react";
import {
  Code,
  File,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  StickyNote,
  Terminal,
} from "lucide-react";

import type { MockItemType } from "./mock-data";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const typeIconsBySlug: Record<MockItemType["slug"], IconComponent> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: FileText,
  file: File,
  image: ImageIcon,
  url: LinkIcon,
};

// Hex colors mirror the ItemType.color values seeded in prisma/seed.ts so
// mock-backed UI (sidebar, pinned/recent rows) matches the DB-backed cards.
export const typeColorsBySlug: Record<MockItemType["slug"], string> = {
  snippet: "#3b82f6",
  prompt: "#8b5cf6",
  command: "#f97316",
  note: "#fde047",
  file: "#6b7280",
  image: "#ec4899",
  url: "#10b981",
};

// Lookup by ItemType.icon (the Lucide component name stored on each row).
export const iconsByLucideName: Record<string, IconComponent> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  FileText,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};
