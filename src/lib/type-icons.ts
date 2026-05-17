import type { ComponentType, SVGProps } from "react";
import {
  Code,
  File,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
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
