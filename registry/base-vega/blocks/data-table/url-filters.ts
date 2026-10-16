// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/data-table.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: useUrlFilters extraído para arquivo próprio e reescrito sem next/navigation. Lê window.location.search por useSyncExternalStore (ouve popstate e um evento próprio disparado a cada replaceState) e escreve com history.replaceState. Mesma assinatura e mesma semântica: default some da URL, page cai em todo patch que não o define, patches do mesmo tick acumulam num ref.
"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

// replaceState não dispara popstate, então quem escreve avisa os outros hooks
// montados na mesma página por este evento. Serve em Next, Vite, Remix ou sem
// roteador nenhum: só depende de window.history.
const CHANGE_EVENT = "lume:urlfilters";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Sem o "?" inicial, igual ao searchParams.toString() do Next que o original
// usava como base de comparação.
function getSnapshot() {
  return window.location.search.replace(/^\?/, "");
}

// No servidor e durante a hidratação a query é vazia: os valores saem nos
// defaults e o React refaz o render com a query real logo depois.
function getServerSnapshot() {
  return "";
}

/**
 * Keeps a list view's filter/search/sort/page state in the URL query string so
 * it survives reload and back-navigation and can be shared as a link.
 *
 * `defaults` declares the managed keys; a key at its default value is dropped
 * from the URL. `patch` merges updates via history replace (no history spam),
 * skips writes that change nothing, and — because changing a filter
 * invalidates the current page — clears `page` on every patch that doesn't set
 * it explicitly. Same-tick patches accumulate in a ref so they don't clobber
 * each other (the router's searchParams only update after navigation).
 */
export function useUrlFilters<K extends string>(
  defaults: Record<K, string>,
): [Record<K, string>, (updates: Partial<Record<K, string>>) => void] {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const searchParams = new URLSearchParams(search);

  const values = {} as Record<K, string>;
  for (const key of Object.keys(defaults) as K[]) {
    values[key] = searchParams.get(key) ?? defaults[key];
  }

  // Same-tick accumulator, keyed to the searchParams snapshot it started from.
  const pendingRef = useRef<{ base: string; params: URLSearchParams } | null>(
    null,
  );
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  const patch = useCallback(
    (updates: Partial<Record<K, string>>) => {
      const base = search;
      const params =
        pendingRef.current?.base === base
          ? pendingRef.current.params
          : new URLSearchParams(base);

      const changed = Object.entries(updates).some(
        ([k, v]) => (params.get(k) ?? defaultsRef.current[k as K]) !== v,
      );
      if (!changed) return;

      for (const [k, v] of Object.entries(updates) as [K, string][]) {
        if (v === defaultsRef.current[k]) params.delete(k);
        else params.set(k, v);
      }
      if (!("page" in updates)) params.delete("page");

      pendingRef.current = { base, params };
      const qs = params.toString();
      // Mesmo pathname, hash preservado (o router.replace do original o
      // descartava; aqui não há motivo para perder uma âncora). Sem scroll,
      // como o scroll: false de antes: replaceState nunca rola a página.
      const { pathname, hash } = window.location;
      window.history.replaceState(
        window.history.state,
        "",
        `${pathname}${qs ? `?${qs}` : ""}${hash}`,
      );
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [search],
  );

  return [values, patch];
}
