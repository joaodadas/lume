// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/span-type.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*; slate virou neutral (bg-neutral-500, text-neutral-600/400 e rgba(115,115,115) na receita do chip, inclusive no fallback); o domínio llm/tool/agent/embedding fica como exemplo canônico de cor com significado.
import {
  type Icon,
  IconCircleDashed,
  IconGhost,
  IconSparkles,
  IconTool,
  IconVector,
} from "@tabler/icons-react";

import { cn } from "@/registry/base-vega/lib/utils";
import { Badge } from "@/registry/base-vega/ui/badge";

// Exemplo canônico de "cor com significado" no lume: cada tipo de span tem UMA
// cor, e a mesma cor aparece no badge, na barra do waterfall e no chip de
// ícone. Para o seu domínio (status de pedido, tipo de evento, ambiente), copie
// o padrão: um mapa por conceito, nunca cor solta no componente. O neutro é
// neutral, a mesma escala dos tokens; slate não existe aqui.

type BadgeVariant = "violet" | "blue" | "amber" | "emerald" | "secondary";

// Badge color per span type. Shared so the type badge, its waterfall bar, and
// any other surface read as one consistent palette.
export const SPAN_TYPE_VARIANT: Record<string, BadgeVariant> = {
  llm: "violet",
  tool: "blue",
  agent: "amber",
  embedding: "emerald",
  other: "secondary",
};

// Icon per span type: a model (llm), a wrench (tool), a ghost (agent), a vector
// (embedding), falling back to a dashed circle for anything else.
export const SPAN_TYPE_ICON: Record<string, Icon> = {
  llm: IconSparkles,
  tool: IconTool,
  agent: IconGhost,
  embedding: IconVector,
  other: IconCircleDashed,
};

// Waterfall bar fill per span type — mirrors the badge color so a row's label
// and its bar read as one.
export const SPAN_TYPE_BAR: Record<string, string> = {
  llm: "bg-violet-500",
  tool: "bg-blue-500",
  agent: "bg-amber-500",
  embedding: "bg-emerald-500",
  other: "bg-neutral-500",
};

export function spanTypeIcon(type: string): Icon {
  return SPAN_TYPE_ICON[type] ?? IconCircleDashed;
}

export function spanTypeVariant(type: string): BadgeVariant {
  return SPAN_TYPE_VARIANT[type] ?? "secondary";
}

export function spanTypeBar(type: string): string {
  return SPAN_TYPE_BAR[type] ?? "bg-primary/70";
}

// Icon-chip palette per span type — a tinted fill + matching foreground, for the
// compact icon-only chip used where a full text badge would be too wide (e.g.
// the waterfall's label gutter). Light mode gets an accent-tinted inset ring +
// drop shadow (same recipe as nav.ts) — --custom-shadow washes out on light.
// A receita do tile: inset de 1px a 14% e sombra 0 2px 6px -2px a 25% da
// mesma cor, em rgba porque o Tailwind não compõe duas sombras com token.
// neutral-500 é rgb(115,115,115).
export const SPAN_TYPE_CHIP: Record<string, string> = {
  llm: "bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.14),0_2px_6px_-2px_rgba(139,92,246,0.25)] dark:shadow-(--custom-shadow)",
  tool: "bg-blue-500/15 text-blue-600 dark:text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.14),0_2px_6px_-2px_rgba(59,130,246,0.25)] dark:shadow-(--custom-shadow)",
  agent:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.14),0_2px_6px_-2px_rgba(245,158,11,0.25)] dark:shadow-(--custom-shadow)",
  embedding:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.14),0_2px_6px_-2px_rgba(16,185,129,0.25)] dark:shadow-(--custom-shadow)",
  other:
    "bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 shadow-[inset_0_0_0_1px_rgba(115,115,115,0.14),0_2px_6px_-2px_rgba(115,115,115,0.25)] dark:shadow-(--custom-shadow)",
};

export function spanTypeChip(type: string): string {
  return (
    SPAN_TYPE_CHIP[type] ??
    "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(115,115,115,0.14),0_2px_6px_-2px_rgba(115,115,115,0.25)] dark:shadow-(--custom-shadow)"
  );
}

/** A compact, icon-only span-type chip — the type's color + icon in a small
 * rounded square, with the type name as a tooltip. Used where horizontal space
 * is tight (the waterfall rows) and the full {@link SpanTypeBadge} is too wide. */
export function SpanTypeChip({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const Icon = spanTypeIcon(type);
  return (
    <span
      title={type}
      className={cn(
        "flex size-4.5 shrink-0 items-center justify-center rounded-md corner-squircle",
        spanTypeChip(type),
        className,
      )}
    >
      {/* Tabler ships no IconToolFilled; filling the outline's closed path
          gets the solid look the other chip icons have. */}
      <Icon className={cn("size-3", type === "tool" && "fill-current")} />
    </span>
  );
}

/** A span-type pill — the type's color + icon + label, used everywhere a span's
 * kind is shown (waterfall labels, the inspector, the scores panel). */
export function SpanTypeBadge({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const Icon = spanTypeIcon(type);
  return (
    <Badge variant={spanTypeVariant(type)} className={cn(className)}>
      <Icon />
      {type}
    </Badge>
  );
}
