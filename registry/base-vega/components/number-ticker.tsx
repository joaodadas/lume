// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: TickerValue (linhas 135-174 do upstream) virou NumberTicker exportado, com format opcional (padrão formatExactCount em pt-BR), className e tabular-nums; respeita useReduce() pulando direto para o valor final (do painel, que lia prefers-reduced-motion por matchMedia).
"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { formatExactCount } from "@/registry/base-vega/lib/format";
import { useReduce } from "@/registry/base-vega/lib/motion";
import { cn } from "@/registry/base-vega/lib/utils";

/**
 * Animated numeric stat: when `value` changes, the digits tween from the old
 * number to the new one, with every intermediate frame run through `format`
 * so the string stays properly formatted ("$1.23", "87%", "1.2K") the whole
 * way. The first paint is static — only later changes animate.
 */
// Duração 0.6 s com easeOut é a única receita de ticker do sistema; o
// formatador recebe frames fracionários, então arredonde dentro dele (os
// format* de lib/format já fazem isso).
export function NumberTicker({
  value,
  format = formatExactCount,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => format(value));
  const animatedFrom = useRef(value);
  // The formatter is often an inline closure — keep the latest without
  // retriggering the animation effect.
  const formatRef = useRef(format);
  formatRef.current = format;
  const reduce = useReduce();

  useEffect(() => {
    const from = animatedFrom.current;
    if (from === value) {
      setDisplay(formatRef.current(value));
      return;
    }
    animatedFrom.current = value;
    // Com reduced motion o número troca de uma vez, sem versão "mais curta".
    if (reduce) {
      setDisplay(formatRef.current(value));
      return;
    }
    const controls = animate(from, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(formatRef.current(v)),
      onComplete: () => setDisplay(formatRef.current(value)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={cn("tabular-nums", className)}>{display}</span>;
}
