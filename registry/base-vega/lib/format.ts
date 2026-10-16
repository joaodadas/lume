// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/lib/format.ts @ 2bc3bb5), Apache-2.0, e do painel do lyx-pr-agent (João Vitor Dadas).
// Modificado por joaodadas/lume: LOCALE pt-BR e TIME_ZONE America/Sao_Paulo em toda formatação, EMPTY ("sem dado") no lugar do travessão, formatDateTime em dd/MM HH:mm, formatRelative em pt-BR ("agora", "há 3 min"), formatMoney (BRL ou USD, com cache) e formatCompact (do numero() do painel); nulo e não finito viram EMPTY; comentários sobre ClickHouse generalizados.

// Formatação de números, moeda, duração e datas do sistema. Tudo passa por Intl
// com LOCALE e TIME_ZONE fixos, para o mesmo valor render igual no servidor e no
// navegador, no Brasil ou fora. Os formatters ficam em cache num Map porque
// Intl.NumberFormat é caro de construir e as tabelas chamam isto por célula.

export const LOCALE = "pt-BR";
export const TIME_ZONE = "America/Sao_Paulo";

/** Placeholder de valor nulo ou desconhecido. Nunca "0" (zero é um valor que
 * existe) e nunca um traço. */
export const EMPTY = "sem dado";

export type Currency = "BRL" | "USD";

const moneyFormatters = new Map<string, Intl.NumberFormat>();
function moneyFormatter(
  currency: Currency,
  minDecimals: number,
  maxDecimals: number,
) {
  const key = `${currency}:${minDecimals}:${maxDecimals}`;
  let f = moneyFormatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency,
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    });
    moneyFormatters.set(key, f);
  }
  return f;
}

/** Dinheiro em BRL (padrão) ou USD: "R$ 1.234,50", "US$ 0,0034". `null`,
 * `undefined` e não finito viram EMPTY. `maxDecimals` (2 por padrão) limita as
 * casas; zeros à direita caem até 2 casas. */
export function formatMoney(
  value: number | null | undefined,
  {
    currency = "BRL",
    maxDecimals = 2,
  }: { currency?: Currency; maxDecimals?: number } = {},
): string {
  if (value === null || value === undefined || !Number.isFinite(value))
    return EMPTY;
  return moneyFormatter(currency, 2, Math.max(2, maxDecimals)).format(value);
}

/** A cost value; `null`/`undefined` → EMPTY (unpriced, never $0). `maxDecimals`
 * caps the fractional digits: 6 (full precision) by default, 4 for the more
 * compact stat-card treatment. Trailing zeros are trimmed back to 2 decimals. */
// Custo de API é em dólar, por isso USD fixo. Para dinheiro em geral, formatMoney.
export function formatCost(
  value: number | null | undefined,
  maxDecimals = 6,
): string {
  return formatMoney(value, { currency: "USD", maxDecimals });
}

/** A cost value padded to exactly `decimals` fraction digits, so a column of
 * them lines up on the decimal point ("US$ 0,003350" above "US$ 0,002773")
 * instead of raggedly trimming trailing zeros. For table cells; elsewhere use
 * `formatCost`, which keeps numbers short. */
export function formatCostFixed(
  value: number | null | undefined,
  decimals: number,
): string {
  if (value === null || value === undefined || !Number.isFinite(value))
    return EMPTY;
  return moneyFormatter("USD", decimals, decimals).format(value);
}

const compact = new Intl.NumberFormat(LOCALE, { notation: "compact" });
const plain = new Intl.NumberFormat(LOCALE);
const twoDecimals = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Count formatters round first: counts are integers by definition, but animated
// stat tickers feed them fractional in-between frames, which would otherwise
// render decimals mid-tween ("1.234,567").
export function formatCount(value: number): string {
  const n = Math.round(value);
  return n >= 1000 ? compact.format(n) : plain.format(n);
}

/** A count with no compaction: "1.024", never "1 mil". For operator figures
 * where the exact number is the point and 1.024 vs 1.499 must not both read
 * "1 mil". */
export function formatExactCount(value: number): string {
  return plain.format(Math.round(value));
}

export function formatTokens(value: number): string {
  return compact.format(value);
}

// Casas que dependem do tamanho, como o numero() do painel: 123 · 12,3 · 0,42.
const byMagnitude = [0, 1, 2].map(
  (d) =>
    new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: d,
    }),
);

/** Número curto para card e chip. Abaixo de mil, casas conforme o tamanho
 * ("123", "12,3", "0,42"); de mil para cima, compacto em pt-BR ("1,2 mil",
 * "12 mil", "3,4 mi", "1,2 bi"). `null`, `undefined` e não finito viram EMPTY. */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value))
    return EMPTY;
  const a = Math.abs(value);
  if (a >= 1000) return compact.format(value);
  const decimals = a >= 100 ? 0 : a >= 10 ? 1 : 2;
  return byMagnitude[decimals].format(value);
}

/** Milliseconds → human duration (µs/ms/s/min/h/d). */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms)) return EMPTY;
  // Exact zero reads as "0s" (not "0µs") everywhere, e.g. latency axes anchored
  // at the origin.
  if (ms === 0) return "0s";
  if (ms < 1) return `${Math.round(ms * 1000)}µs`;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  // Segundos com vírgula ("1,23s"), como o resto do sistema.
  if (ms < 60_000) return `${twoDecimals.format(ms / 1000)}s`;
  // Beyond a minute, build from the largest non-zero unit and show at most two
  // components so e.g. an even hour reads "1h", not "60min 0s".
  const totalSec = Math.round(ms / 1000);
  const d = Math.floor(totalSec / 86_400);
  const h = Math.floor((totalSec % 86_400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}min`);
  if (s) parts.push(`${s}s`);
  return parts.slice(0, 2).join(" ") || "0s";
}

/** A recorded span/trace duration. Storage is whole milliseconds, so an exact 0
 * means "finished in under 1ms", not "took no time": render it as such. Axes
 * and aggregates should keep using formatDuration ("0s" at the origin). */
export function formatSpanDuration(ms: number): string {
  if (ms === 0) return "<1ms";
  return formatDuration(ms);
}

/** Fração (0.42) em porcentagem inteira ("42%"). Nulo e não finito viram EMPTY. */
export function formatPercent(fraction: number | null | undefined): string {
  if (fraction === null || fraction === undefined || !Number.isFinite(fraction))
    return EMPTY;
  return `${Math.round(fraction * 100)}%`;
}

/** 'YYYY-MM-DD HH:MM:SS' strings without a zone (UTC, the shape most databases
 * hand back) or ISO → Date. */
// Troca o espaço por "T" e acrescenta "Z" quando não há fuso; o resto é ISO.
export function parseDateTime(value: string | Date): Date {
  if (value instanceof Date) return value;

  const normalized = value.replace(" ", "T");
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  return new Date(hasTimezone ? normalized : `${normalized}Z`);
}

const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
function dateTimeParts(d: Date, seconds: boolean): Record<string, string> {
  const key = seconds ? "seconds" : "minutes";
  let f = dateTimeFormatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(LOCALE, {
      timeZone: TIME_ZONE,
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" as const } : {}),
      // Always 24-hour, regardless of the viewer's locale default.
      hourCycle: "h23",
    });
    dateTimeFormatters.set(key, f);
  }
  const out: Record<string, string> = {};
  for (const p of f.formatToParts(d)) out[p.type] = p.value;
  return out;
}

/** Instante → "dd/MM HH:mm" no fuso de TIME_ZONE ("05/10 14:32"), com segundos
 * quando pedido ("05/10 14:32:07"). Monta a partir de formatToParts porque o
 * pt-BR do Intl põe vírgula entre data e hora. Nulo vira EMPTY; string que não
 * é data volta como veio. */
export function formatDateTime(
  value: string | Date | null | undefined,
  { seconds = false }: { seconds?: boolean } = {},
): string {
  if (!value) return EMPTY;
  const d = parseDateTime(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const p = dateTimeParts(d, seconds);
  const time = seconds
    ? `${p.hour}:${p.minute}:${p.second}`
    : `${p.hour}:${p.minute}`;
  return `${p.day}/${p.month} ${time}`;
}

/** Quanto tempo atrás, em pt-BR: "agora" (menos de 1 min), "há 3 min",
 * "há 2 h", "há 5 d". Nulo vira EMPTY. */
export function formatRelative(
  value: string | Date | null | undefined,
): string {
  if (!value) return EMPTY;
  const d = parseDateTime(value);
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(diff)) return String(value);
  // Clamp clock skew: a server timestamp slightly ahead of the client must not
  // render as "-3s ago".
  const sec = Math.max(0, Math.round(diff / 1000));
  if (sec < 60) return "agora";
  const min = Math.round(sec / 60);
  if (min < 60) return `há ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `há ${hr} h`;
  return `há ${Math.round(hr / 24)} d`;
}

export type Delta = { pct: number; dir: "up" | "down" | "flat" };

/**
 * Period-over-period change as a fraction + direction. `null` when there's no
 * baseline to compare against (previous is null/zero): the caller renders EMPTY.
 */
export function formatDelta(
  current: number | null | undefined,
  previous: number | null | undefined,
): Delta | null {
  if (current === null || current === undefined) return null;
  if (previous === null || previous === undefined || previous === 0)
    return null;
  const pct = (current - previous) / previous;
  const dir = Math.abs(pct) < 0.0001 ? "flat" : pct > 0 ? "up" : "down";
  return { pct, dir };
}

/** Extrapolate a window's cost to a 30-day run-rate. `null` when cost is unknown. */
export function projectMonthlyCost(
  cost: number | null | undefined,
  windowMs: number,
): number | null {
  if (cost === null || cost === undefined || windowMs <= 0) return null;
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  return (cost / windowMs) * THIRTY_DAYS;
}
