// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só SkeletonCol e TableRowsSkeleton (linhas 718-788 do upstream), em arquivo próprio; TableSkeleton e CardsSkeleton ficaram de fora (código morto no Foglamp); imports reescritos para @/registry/base-vega/*.

import { cn } from "@/registry/base-vega/lib/utils";
import { Skeleton } from "@/registry/base-vega/ui/skeleton";
import { TableCell, TableRow } from "@/registry/base-vega/ui/table";

/** One column of a `TableRowsSkeleton` row. Omit `w` for an empty cell (e.g.
 * an actions column). `icon` adds a small square blob before the text blob. */
export type SkeletonCol = {
  w?: string;
  align?: "left" | "right";
  icon?: boolean;
  /** Width class for a second, smaller meta line under the main blob —
   * for two-line details cells (traces/sessions). The two lines reproduce
   * the real cell's line boxes (h-5 name + gap-1 + mt-0.5 + h-4 meta), so
   * the skeleton row height matches the data rows without hardcoding it. */
  sub?: string;
};

/**
 * Placeholder body rows for a list table while its query is in flight. The
 * page's chrome (toolbar, column headers) renders immediately; only these
 * rows shimmer, one blob per column, mirroring the real cells' alignment.
 * Pair with a `table-fixed` Table so the skeleton→data swap can't shift
 * column widths.
 */
// Só pinte depois do useDelayedLoading (700 ms): carga rápida nunca pisca
// esqueleto.
export function TableRowsSkeleton({
  rows = 3,
  cols,
  rowHeight = "h-12",
}: {
  rows?: number;
  cols: readonly SkeletonCol[];
  /** Height class matching the real rows, when they're taller than the
   * standard h-12 (e.g. two-line cells). */
  rowHeight?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        // Linhas e células do esqueleto são idênticas e nunca reordenam: o
        // índice é a chave.
        <TableRow
          // biome-ignore lint/suspicious/noArrayIndexKey: linhas idênticas de esqueleto
          key={i}
        >
          {cols.map((c, j) => (
            <TableCell
              // biome-ignore lint/suspicious/noArrayIndexKey: células idênticas de esqueleto
              key={j}
              align={c.align}
              className={rowHeight}
            >
              {c.sub ? (
                <div className="flex flex-col gap-1">
                  <div className="flex h-5 items-center gap-2">
                    {c.icon && (
                      <Skeleton className="size-4 shrink-0 rounded-md" />
                    )}
                    <Skeleton className={cn("h-4", c.w)} />
                  </div>
                  <div className="mt-0.5 flex h-4 items-center">
                    <Skeleton className={cn("h-3", c.sub)} />
                  </div>
                </div>
              ) : (
                c.w && (
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      c.align === "right" && "justify-end",
                    )}
                  >
                    {c.icon && (
                      <Skeleton className="size-4 shrink-0 rounded-md" />
                    )}
                    <Skeleton className={cn("h-4", c.w)} />
                  </div>
                )
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
