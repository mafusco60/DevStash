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

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Lookup by ItemType.icon (the Lucide component name stored on each row).
export const iconsByLucideName: Partial<Record<string, IconComponent>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  FileText,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};
