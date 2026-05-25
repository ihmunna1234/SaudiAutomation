import {
  CreditCard,
  FileSpreadsheet,
  ScanLine,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  accent: "indigo" | "emerald" | "amber" | "rose" | "sky";
  available: boolean;
  tags: string[];
}

/** Add new tools here — they appear on the home page automatically */
export const tools: ToolDefinition[] = [
  {
    id: "iqama",
    name: "Iqama Scanner",
    description:
      "Upload 1–200 Iqama images, extract names, ID, BOD & expiry, then download Excel.",
    path: "/tools/iqama",
    icon: CreditCard,
    accent: "indigo",
    available: true,
    tags: ["OCR", "Bulk", "Excel"],
  },
  {
    id: "passport",
    name: "Passport Scanner",
    description: "Extract passport data from images and export to Excel.",
    path: "/tools/passport",
    icon: ScanLine,
    accent: "emerald",
    available: false,
    tags: ["OCR", "Coming soon"],
  },
  {
    id: "visa",
    name: "Visa Document Parser",
    description: "Parse visa documents and build structured reports.",
    path: "/tools/visa",
    icon: FileText,
    accent: "amber",
    available: false,
    tags: ["Documents", "Coming soon"],
  },
  {
    id: "bulk-excel",
    name: "Bulk Excel Merger",
    description: "Combine multiple Excel files into one master sheet.",
    path: "/tools/excel-merger",
    icon: FileSpreadsheet,
    accent: "sky",
    available: false,
    tags: ["Excel", "Coming soon"],
  },
];

export const accentStyles: Record<
  ToolDefinition["accent"],
  { bg: string; text: string; border: string; glow: string }
> = {
  indigo: {
    bg: "bg-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-200",
    glow: "shadow-indigo-500/20",
  },
  emerald: {
    bg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-emerald-500/20",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-amber-500/20",
  },
  rose: {
    bg: "bg-rose-600",
    text: "text-rose-600",
    border: "border-rose-200",
    glow: "shadow-rose-500/20",
  },
  sky: {
    bg: "bg-sky-600",
    text: "text-sky-600",
    border: "border-sky-200",
    glow: "shadow-sky-500/20",
  },
};
