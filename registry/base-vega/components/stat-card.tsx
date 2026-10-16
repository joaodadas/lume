// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: só StatCard e DeltaBadge (linhas 176-352 do upstream); Link da indireção e href string no lugar de next/link e Route; ticker via NumberTicker; Delta de @/registry/base-vega/lib/format; do painel vieram deltaTitle (título da seta, padrão em pt-BR) e o title no rótulo truncado; o resto das classes verbatim.
"use client";

import {
  type Icon,
  IconArrowDownRight,
  IconArrowUpRight,
  IconChevronRight,
} from "@tabler/icons-react";

import { Link } from "@/registry/base-vega/components/link";
import { NumberTicker } from "@/registry/base-vega/components/number-ticker";
import type { Delta } from "@/registry/base-vega/lib/format";
import { cn } from "@/registry/base-vega/lib/utils";
import { Card, CardHeader, CardTitle } from "@/registry/base-vega/ui/card";
import { Skeleton } from "@/registry/base-vega/ui/skeleton";

/**
 * A single metric tile for a stat strip. Within a strip, order cards by the
 * canonical narrative — **Volume → Health → Performance → Cost** — i.e. lead
 * with the primary count/throughput (e.g. Traces, Runs, Spans), then health
 * (errors / pass rate), then performance (latency / duration), and always
 * close with cost. Cost is the bottom-line figure and sits last everywhere.
 */
// Dentro de um StatGrid os cartões esticam na mesma altura (grid) e o chart
// vai para o rodapé com mt-auto, então os gráficos alinham entre vizinhos.
export function StatCard({
  label,
  value,
  hint,
  delta,
  deltaInverted = false,
  deltaTitle,
  size = "default",
  icon: Icon,
  iconClassName,
  chart,
  prefix,
  suffix,
  formatValue,
  loading = false,
  skeleton = false,
  chartPlaceholder,
  href,
}: {
  label: string;
  /** Makes the whole card a link: pointer cursor, and a chevron slides in
   * after the label on hover to signal the drill-down. */
  href?: string;
  /** A `number` gets the ticker treatment — on change the digits animate to
   * the new value, formatted each frame by `formatValue` and wrapped in
   * `prefix`/`suffix`. Any other ReactNode (a preformatted string, "—", …)
   * renders statically. */
  value: React.ReactNode;
  /** Accepted for callers, but not rendered in the current layout (the card
   * shows only label, delta, and value). */
  hint?: React.ReactNode;
  /** Static element rendered before an animated numeric value. */
  prefix?: React.ReactNode;
  /** Static element rendered after an animated numeric value. */
  suffix?: React.ReactNode;
  /** Formats an animated numeric value each frame (e.g. `formatCost`).
   * Defaults to a rounded locale string. */
  formatValue?: (n: number) => string;
  /** Period-over-period change (from `formatDelta`); null/undefined hides it. */
  delta?: Delta | null;
  /** When true, "up" is bad (red) — for cost / errors / latency. */
  deltaInverted?: boolean;
  /** Tooltip da seta de variação. Padrão "vs. período anterior". */
  deltaTitle?: string;
  /** "sm" tightens the card padding and value text for dense layouts. */
  size?: "default" | "sm";
  /** Optional glyph shown in the card's top-right corner (prefer a filled
   * variant). */
  icon?: Icon;
  /** Color class for the icon, e.g. `text-amber-500`. Defaults to muted. */
  iconClassName?: string;
  /** Full-bleed visual pinned to the card's bottom edge — e.g. a
   * `CardSparkline` or `PillMeter`. Bleeds past the card's vertical padding. */
  chart?: React.ReactNode;
  /** While true the static shell (icon + label) stays put and the value,
   * delta, and chart slots are held empty at their final heights, so
   * the data drops into place without shifting the card. */
  loading?: boolean;
  /** With `loading`, paints shimmer blobs in the value and delta
   * slots (pair with `useDelayedLoading` so fast loads never flash them).
   * The chart slot shows `chartPlaceholder` (or stays blank). */
  skeleton?: boolean;
  /** Loading stand-in for the chart slot, e.g. a gray `CardSparklinePlaceholder`
   * or an all-inactive `PillMeter`. Shown once `skeleton` flips; the slot is
   * held blank at full height before that. */
  chartPlaceholder?: React.ReactNode;
}) {
  // hint fica aceito pela compatibilidade de chamada; não renderiza (upstream).
  void hint;
  const hold = loading ? (skeleton ? "skeleton" : "blank") : null;
  const placeholderClass = hold === "blank" ? "invisible" : undefined;
  const card = (
    <Card size={size} className={cn(href && "h-full cursor-pointer")}>
      <CardHeader className="gap-1.5">
        {/* Icon + label on the left; the delta badge and value on the right. */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.75">
            {Icon && (
              <Icon
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground",
                  iconClassName,
                )}
              />
            )}
            {/* A plain span, not CardDescription: its data-slot would make
                CardHeader reserve a second grid row (plus gap) under this
                single row, leaving extra space at the bottom of chartless
                cards. */}
            <span className="truncate text-sm text-foreground" title={label}>
              {label}
            </span>
            {href && (
              <IconChevronRight className="mt-px size-3.5 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-[opacity,translate] duration-150 group-hover/stat:translate-x-0 group-hover/stat:opacity-100" />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {hold
              ? null
              : delta && (
                  <DeltaBadge
                    delta={delta}
                    inverted={deltaInverted}
                    title={deltaTitle}
                  />
                )}
            <CardTitle className="tracking-tight tabular-nums">
              {hold ? (
                // Zero-width text keeps the title's line box so the row
                // height matches the loaded card exactly.
                <span className="inline-flex items-center">
                  {"​"}
                  <Skeleton className={cn("h-3 w-20", placeholderClass)} />
                </span>
              ) : typeof value === "number" ? (
                <>
                  {prefix}
                  <NumberTicker value={value} format={formatValue} />
                  {suffix}
                </>
              ) : (
                value
              )}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      {hold && chart ? (
        // Held at the height of the tallest chart slot (PillMeter:
        // 6 + 14 + 20px) so the chart appears without growing the card;
        // the placeholder (if any) paints in the same box after the delay.
        <div className="mt-auto pt-1.5 -mb-6 group-data-[size=sm]/card:-mb-5">
          <div className="flex h-10 w-full flex-col justify-end">
            {hold === "skeleton" && chartPlaceholder}
          </div>
        </div>
      ) : (
        chart && (
          <div className="mt-auto pt-1.5 -mb-6 group-data-[size=sm]/card:-mb-5">
            {chart}
          </div>
        )
      )}
    </Card>
  );
  if (!href) return card;
  return (
    <Link href={href} className="group/stat block min-w-0">
      {card}
    </Link>
  );
}

export function DeltaBadge({
  delta,
  inverted,
  title = "vs. período anterior",
}: {
  delta: Delta;
  inverted: boolean;
  title?: string;
}) {
  if (delta.dir === "flat") {
    return (
      <span className="text-xs font-medium tabular-nums text-muted-foreground mt-px">
        ~0%
      </span>
    );
  }
  const up = delta.dir === "up";
  const good = inverted ? !up : up;
  const Arrow = up ? IconArrowUpRight : IconArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-px text-xs font-[470] tabular-nums mt-px",
        good
          ? "text-emerald-600 dark:text-emerald-500"
          : "text-red-500 dark:text-red-500",
      )}
      title={title}
    >
      {Math.abs(Math.round(delta.pct * 100))}%
      <Arrow className="size-3.75 stroke-[1.6]" />
    </span>
  );
}
