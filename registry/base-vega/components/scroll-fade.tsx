// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só ScrollFade (linhas 535-604 do upstream), em arquivo próprio; imports reescritos para @/registry/base-vega/*.
"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/registry/base-vega/lib/utils";

/**
 * A scroll viewport with fade overlays: the top fade appears once scrolled away
 * from the top, the bottom fade while there's more content below. Both track the
 * live scroll position (and recompute when the content size changes, e.g. data
 * finishes loading). `fromClassName` sets the fade's solid color — default
 * `from-card` for in-card lists; pass `from-popover` inside a dialog.
 */
// A utility no-scrollbar vem do shadcn/tailwind.css, que o globals.css da base
// já importa. São overlays coloridos, não mask-image: por isso fromClassName
// precisa casar com o fundo de onde o ScrollFade está.
export function ScrollFade({
  children,
  className,
  containerClassName,
  fromClassName = "from-card",
  bottomFadeClassName,
}: {
  children: React.ReactNode;
  /** Classes for the scroll viewport (e.g. `max-h-88`, padding). */
  className?: string;
  /** Classes for the outer wrapper — use to make the fade box participate in a
   * flex column (`min-h-0 flex-1`) instead of a fixed max-height. */
  containerClassName?: string;
  fromClassName?: string;
  /** Overrides for the bottom fade while it shows (e.g. `h-14 opacity-100`
   * for a stronger edge). */
  bottomFadeClassName?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });
  const update = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    setEdges({
      top: el.scrollTop > 1,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
    });
  }, []);
  useLayoutEffect(() => {
    update();
    const el = content.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);
  return (
    <div className={cn("relative no-scrollbar", containerClassName)}>
      <div
        ref={viewport}
        onScroll={update}
        className={cn("overflow-y-auto no-scrollbar", className)}
      >
        <div ref={content}>{children}</div>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b to-transparent transition-opacity duration-150",
          fromClassName,
          edges.top ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t to-transparent transition-opacity duration-150",
          fromClassName,
          edges.bottom ? cn("opacity-75", bottomFadeClassName) : "opacity-0",
        )}
      />
    </div>
  );
}
