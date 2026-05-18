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
