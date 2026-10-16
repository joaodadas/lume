// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/range-context.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*; a chave do localStorage virou a prop storageKey (padrão "lume.range") e setRange passou a useCallback para o contexto acompanhar a chave.
"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  defaultRange,
  exactRange,
  type RangeValue,
  resolvePreset,
} from "@/registry/base-vega/lib/range";

type RangeContextValue = {
  range: RangeValue;
  setRange: (range: RangeValue) => void;
};

const RangeContext = createContext<RangeContextValue | null>(null);

// Shared time-range filter so switching tabs keeps the same window. Relative
// presets are re-resolved to "now" on load; custom ranges restore their dates.
// storageKey separa apps (ou áreas de um app) que não devem compartilhar o
// período salvo.
export function RangeProvider({
  children,
  storageKey = "lume.range",
}: {
  children: React.ReactNode;
  storageKey?: string;
}) {
  const [range, setRangeState] = useState<RangeValue>(() => defaultRange());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const v = JSON.parse(raw) as { key: string; from: string; to: string };
      if (v.key && v.key !== "custom") {
        setRangeState(resolvePreset(v.key));
      } else if (v.from && v.to) {
        // Exact restore keeps sub-day windows (chart drag-zooms) intact;
        // calendar ranges are stored day-snapped already, so they round-trip.
        setRangeState(exactRange(new Date(v.from), new Date(v.to)));
      }
    } catch {
      // ignore malformed storage
    }
  }, [storageKey]);

  const setRange = useCallback(
    (next: RangeValue) => {
      setRangeState(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            key: next.key,
            from: next.from.toISOString(),
            to: next.to.toISOString(),
          }),
        );
      }
    },
    [storageKey],
  );

  const value = useMemo<RangeContextValue>(
    () => ({ range, setRange }),
    [range, setRange],
  );

  return <RangeContext value={value}>{children}</RangeContext>;
}

export function useRange(): RangeContextValue {
  const ctx = use(RangeContext);
  if (!ctx) throw new Error("useRange must be used within RangeProvider");
  return ctx;
}
