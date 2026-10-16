// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/copy-icon.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: cn de @/registry/base-vega/lib/utils e COPY_SPRING importado de lib/motion no lugar da constante local (mesmos valores: spring, duration 0.25, bounce 0).
"use client";

import { IconCircleCheckFilled, IconCopyFilled } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

import { COPY_SPRING } from "@/registry/base-vega/lib/motion";
import { cn } from "@/registry/base-vega/lib/utils";

// A micro-interação de copiar: o ícone de cópia vira check com blur, scale e
// fade (a receita "icon morph" do craft). É o mesmo ícone dentro do
// CopyButton, do CodeBlock e de qualquer Button que copie algo.
export function CopyIcon({
  copied,
  className,
  checkClassName,
}: {
  copied: boolean;
  /** Classes applied to the copy icon (and the check icon unless `checkClassName` is set). */
  className?: string;
  /** Classes applied to the check icon. Defaults to `className`. */
  checkClassName?: string;
}) {
  // `relative` so the exiting (position: absolute, via popLayout) icon is pinned
  // directly over the entering one instead of momentarily stacking below it.
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          className="inline-flex"
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={COPY_SPRING}
        >
          {copied ? (
            <IconCircleCheckFilled
              className={cn(
                // Page-surface greens. Inside a default-variant Button the chip's
                // bg inverts against the theme, so those call sites pass the
                // inverted pair via `checkClassName`.
                "text-green-600 dark:text-green-400",
                checkClassName ?? className,
              )}
            />
          ) : (
            <IconCopyFilled className={className} />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
