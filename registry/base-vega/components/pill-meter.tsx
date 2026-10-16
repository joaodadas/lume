// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só PillMeter (linhas 493-533 do upstream), em arquivo próprio; imports reescritos para @/registry/base-vega/*.

import { cn } from "@/registry/base-vega/lib/utils";

/**
 * A segmented "pill" meter for a `StatCard`'s `chart` slot — visualizes a ratio
 * metric (error rate, pass rate) as a row of capsules, the leading `fraction`
 * of which are lit in the accent color (`text-*` on `className`). Any positive
 * fraction lights at least one pill so small-but-nonzero rates stay visible;
 * `null` lights none (no data). Re-adds the card's horizontal inset since the
 * chart slot bleeds full-width.
 */
export function PillMeter({
  fraction,
  count = 32,
  className,
}: {
  fraction: number | null;
  /** Number of capsules in the row. */
  count?: number;
  className?: string;
}) {
  const pct = fraction == null ? 0 : Math.min(Math.max(fraction, 0), 1);
  const filled = pct > 0 ? Math.max(1, Math.round(pct * count)) : 0;
  return (
    <div
      className={cn(
        "px-6 pt-1.5 pb-5 group-data-[size=sm]/card:px-5",
        className,
      )}
    >
      <div className="flex h-3.5 items-stretch gap-0.75">
        {Array.from({ length: count }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: as cápsulas são idênticas e nunca reordenam, o índice é a chave
            key={i}
            className={cn(
              "flex-1 rounded-full",
              i < filled ? "bg-current" : "bg-muted-foreground/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}
