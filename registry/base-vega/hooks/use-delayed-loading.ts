// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/hooks.ts @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só useDelayedLoading e useSkeletonShown, em arquivo próprio (o resto do hooks.ts virou use-entrance-once e use-debounced-value).
"use client";

import { useEffect, useRef, useState } from "react";

// General-purpose UI hooks shared across list/table pages. These used to live in
// data-table.tsx, which leaked them as an implicit public API; they have nothing
// to do with the table component itself.

/** Gates a loading skeleton behind a delay so quick loads don't flash one.
 * Returns true only once `loading` has stayed true for `delay` ms; loads that
 * resolve sooner never show the skeleton. Render `null` (not the empty state)
 * while loading but this is still false. */
// 700 ms é o valor praticado em todas as páginas do Foglamp; não mude por tela.
export function useDelayedLoading(loading: boolean, delay = 700): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!loading) {
      setShow(false);
      return;
    }
    const id = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(id);
  }, [loading, delay]);
  return show;
}

/** Latches whether a slot's delayed skeleton has ever been shown this visit.
 * Whatever paints first in a slot gets the entrance fade — the skeleton on
 * slow loads, the real card when data beats the skeleton delay — and the
 * skeleton→card swap itself stays instant, so a card whose slot already showed
 * a skeleton must skip the fade. */
export function useSkeletonShown(showing: boolean): boolean {
  const ever = useRef(false);
  if (showing) ever.current = true;
  return ever.current;
}
