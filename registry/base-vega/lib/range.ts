// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/lib/range.ts @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: rótulos dos presets em pt-BR, format do date-fns com locale ptBR e padrões "d MMM" / "d MMM yyyy", intervalos escritos com "a" no lugar da meia-risca, preset padrão nomeado em vez de non-null assertion.

import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subHours,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Presets e rótulos do seletor de período (range-picker). Datas absolutas saem
// em pt-BR: "10 ago", "10 ago 2026", "10 ago, 14:32". O ano só aparece quando
// não é o corrente.
const fmt = (d: Date, pattern: string) => format(d, pattern, { locale: ptBR });

export type RangeValue = {
  /** Originating preset key, or "custom" for a calendar-selected range. */
  key: string;
  label: string;
  from: Date;
  to: Date;
};

type Preset = {
  key: string;
  label: string;
  resolve: (now: Date) => { from: Date; to: Date };
};

// Preset padrão nomeado para o fallback de resolvePreset não depender de índice.
const LAST_24H: Preset = {
  key: "24h",
  label: "Últimas 24 horas",
  resolve: (n) => ({ from: subHours(n, 24), to: n }),
};

export const RANGE_PRESETS: Preset[] = [
  {
    key: "1h",
    label: "Última hora",
    resolve: (n) => ({ from: subHours(n, 1), to: n }),
  },
  LAST_24H,
  {
    key: "3d",
    label: "Últimos 3 dias",
    resolve: (n) => ({ from: subDays(n, 3), to: n }),
  },
  {
    key: "7d",
    label: "Últimos 7 dias",
    resolve: (n) => ({ from: subDays(n, 7), to: n }),
  },
  {
    key: "30d",
    label: "Últimos 30 dias",
    resolve: (n) => ({ from: subDays(n, 30), to: n }),
  },
  {
    key: "90d",
    label: "Últimos 90 dias",
    resolve: (n) => ({ from: subDays(n, 90), to: n }),
  },
  {
    key: "today",
    label: "Hoje",
    resolve: (n) => ({ from: startOfDay(n), to: n }),
  },
  {
    key: "month",
    label: "Este mês",
    resolve: (n) => ({ from: startOfMonth(n), to: n }),
  },
  {
    key: "lastMonth",
    label: "Mês passado",
    resolve: (n) => {
      const start = startOfMonth(subMonths(n, 1));
      return { from: start, to: endOfMonth(start) };
    },
  },
];

export function resolvePreset(key: string, now: Date = new Date()): RangeValue {
  const p = RANGE_PRESETS.find((x) => x.key === key) ?? LAST_24H;
  const { from, to } = p.resolve(now);
  return { key: p.key, label: p.label, from, to };
}

export function defaultRange(): RangeValue {
  return resolvePreset("24h");
}

/** A calendar-selected absolute range (whole days, inclusive of the end day). */
export function customRange(from: Date, to: Date): RangeValue {
  const f = startOfDay(from);
  const t = endOfDay(to);
  return { key: "custom", label: formatRangeLabel(f, t), from: f, to: t };
}

/** An absolute range at full time precision, produced by dragging a zoom
 * selection on a chart (and used to restore stored custom ranges verbatim).
 * Whole-day ranges keep the calendar picker's date-only label. */
export function exactRange(from: Date, to: Date): RangeValue {
  return { key: "custom", label: formatExactLabel(from, to), from, to };
}

function formatExactLabel(from: Date, to: Date): string {
  const wholeDays =
    from.getTime() === startOfDay(from).getTime() &&
    to.getTime() === endOfDay(to).getTime();
  if (wholeDays) return formatRangeLabel(from, to);
  const sameDay = startOfDay(from).getTime() === startOfDay(to).getTime();
  if (sameDay) return `${fmt(from, "d MMM, HH:mm")} a ${fmt(to, "HH:mm")}`;
  const sameYear = from.getFullYear() === to.getFullYear();
  const pattern = sameYear ? "d MMM, HH:mm" : "d MMM yyyy, HH:mm";
  return `${fmt(from, pattern)} a ${fmt(to, pattern)}`;
}

/** Absolute readout of a resolved window, minute precision: "10 ago, 14:32 a
 * 11 ago, 14:32". The year only appears when it isn't the current one. */
export function formatRangeWindow(
  from: Date,
  to: Date,
  now: Date = new Date(),
): string {
  const at = (d: Date) =>
    fmt(
      d,
      d.getFullYear() === now.getFullYear()
        ? "d MMM, HH:mm"
        : "d MMM yyyy, HH:mm",
    );
  return `${at(from)} a ${at(to)}`;
}

export function formatRangeLabel(from: Date, to: Date): string {
  const sameDay = startOfDay(from).getTime() === startOfDay(to).getTime();
  if (sameDay) return fmt(from, "d MMM yyyy");
  const sameYear = from.getFullYear() === to.getFullYear();
  return `${fmt(from, sameYear ? "d MMM" : "d MMM yyyy")} a ${fmt(to, "d MMM yyyy")}`;
}
