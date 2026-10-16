// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/hooks.ts @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só useDebouncedValue e useTextFilter, em arquivo próprio; o eslint-disable virou biome-ignore.
"use client";

import { useEffect, useMemo, useState } from "react";

/** Debounces a rapidly-changing value (e.g. a search box) so server-backed
 * tables don't refetch on every keystroke. */
// 300 ms é o valor praticado no Foglamp para busca em tabela.
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Convenience: debounced-free filter for a free-text search over one or more
 * string fields of a row. Case-insensitive substring match. */
export function useTextFilter<T>(
  rows: readonly T[],
  query: string,
  fields: (row: T) => (string | null | undefined)[],
): T[] {
  // `fields` is a stable inline accessor; intentionally omitted from deps.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `fields` é um acessor inline estável, fora das deps de propósito (comentário do autor acima).
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...rows];
    return rows.filter((row) =>
      fields(row).some((f) => f?.toLowerCase().includes(q)),
    );
  }, [rows, query]);
}
