// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/copy-button.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/* (CopyIcon de components, useCopied de hooks).
"use client";

import { CopyIcon } from "@/registry/base-vega/components/copy-icon";
import { useCopied } from "@/registry/base-vega/hooks/use-copied";
import { cn } from "@/registry/base-vega/lib/utils";

// Botão nu (não o primitivo Button) para copiar um valor em linha de tabela,
// chip ou bolha de chat. Nas bolhas aparece só no hover:
// `opacity-0 group-hover/bubble:opacity-100`.

/** Copy a value to the clipboard with a brief check-mark confirmation.
 *
 * - `stopPropagation` — call `e.stopPropagation()` on click; use when the
 *   button sits inside a clickable table row or card.
 * - `iconSize` — Tailwind size class applied to both icons (default `"size-4"`).
 * - `className` — additional classes for the `<button>` element. */
export function CopyButton({
  value,
  title,
  stopPropagation,
  iconSize = "size-4",
  className,
}: {
  value: string;
  /** Tooltip nativo e nome acessível do botão, por exemplo "Copiar ID". */
  title: string;
  stopPropagation?: boolean;
  iconSize?: string;
  className?: string;
}) {
  const { copied, markCopied } = useCopied();
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        void navigator.clipboard.writeText(value);
        markCopied();
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded p-1 text-muted-foreground/60 cursor-pointer transition-colors hover:text-foreground",
        className,
      )}
    >
      <CopyIcon
        copied={copied}
        className={iconSize}
        checkClassName={cn(iconSize)}
      />
    </button>
  );
}
