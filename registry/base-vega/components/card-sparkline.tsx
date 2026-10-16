// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/page-parts.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só CardSparkline e CardSparklinePlaceholder (linhas 354-491 do upstream), em arquivo próprio; imports reescritos para @/registry/base-vega/*.
"use client";

import { useId } from "react";

import { cn } from "@/registry/base-vega/lib/utils";

/**
 * A full-bleed area sparkline for a `StatCard`'s `chart` slot — a compact trend
 * of a volume metric (tokens, cost, requests). The accent color comes from the
 * `text-*` class on `className`; the area fades from that color to transparent.
 * When `dashedLast` is set, the final segment renders dashed to signal the
 * trailing bucket is still filling. With fewer than two finite points it falls
 * back to a faint sample trend (`CardSparklinePlaceholder`) so the card mirrors
 * `PillMeter`'s empty state instead of leaving a blank strip.
 */
export function CardSparkline({
  data,
  dashedLast = false,
  className,
}: {
  data: number[];
  dashedLast?: boolean;
  className?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const pts = data.filter((n) => Number.isFinite(n));
  if (pts.length < 2) return <CardSparklinePlaceholder />;

  const W = 100;
  const H = 32;
  const PAD = 3;
  const max = Math.max(...pts, 0);
  const span = max > 0 ? max : 1;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * W;
    const y = H - PAD - (v / span) * (H - PAD);
    return [x, y] as const;
  });

  const toPath = (slice: ReadonlyArray<readonly [number, number]>) =>
    slice
      .map(
        ([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`,
      )
      .join(" ");

  const linePath = toPath(coords);
  const areaPath = `${linePath} L${W} ${H} L0 ${H} Z`;
  // Split the stroke so the trailing segment can be dashed independently.
  const solid = dashedLast ? coords.slice(0, -1) : coords;
  const tail = dashedLast ? coords.slice(-2) : [];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("block h-8 w-full overflow-visible", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} stroke="none" />
      {solid.length >= 2 && (
        <path
          d={toPath(solid)}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          strokeOpacity={0.5}
        />
      )}
      {tail.length === 2 && (
        <path
          d={toPath(tail)}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="2.5 2"
          vectorEffect="non-scaling-stroke"
          strokeOpacity={0.5}
        />
      )}
    </svg>
  );
}

// A fixed, gently rising sample curve (normalized 0..1, where 1 is the top of
// the strip) drawn when a `CardSparkline` has no real series yet — the
// area-chart counterpart to `PillMeter`'s unlit capsule row.
const SAMPLE_SPARKLINE = [0.3, 0.45, 0.38, 0.55, 0.48, 0.66, 0.58, 0.75];

/** Faint placeholder trend for an empty `CardSparkline`. Ignores the caller's
 * accent and renders in the muted color so the card reads as "trend goes here"
 * rather than leaving a blank strip below the value. */
export function CardSparklinePlaceholder() {
  const gid = useId().replace(/:/g, "");
  const W = 100;
  const H = 32;
  const PAD = 2;
  const coords = SAMPLE_SPARKLINE.map((v, i) => {
    const x = (i / (SAMPLE_SPARKLINE.length - 1)) * W;
    const y = H - PAD - v * (H - PAD);
    return [x, y] as const;
  });
  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${W} ${H} L0 ${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="block h-8 w-full text-muted-foreground"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.03} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.1}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
