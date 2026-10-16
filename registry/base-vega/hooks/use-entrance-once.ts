// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/hooks.ts @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só useEntranceOnce, em arquivo próprio; o CSS de .page-fade-in (apps/web/src/index.css do Foglamp) é instalado pelo campo css do item.
"use client";

import { useEffect, useState } from "react";

// Linear-style entrance gate, shared across every app page: module state
// survives client-side navigations but resets on a hard reload, so exactly one
// page — whichever the user landed on — plays its entrance fade per app boot,
// and everything after that renders instantly.
let entrancePlayed = false;

/** True only on the first page mount after a hard load. Pair with the
 * `page-fade-in` class on the page header and card slots. */
// A classe vem com o item (campo css): @keyframes page-fade-in { from { opacity: 0 } },
// .page-fade-in { animation: page-fade-in 75ms ease-out } e animation: none sob
// prefers-reduced-motion. Em projeto sem a CLI, copie esse bloco para o CSS global.
// Uso: const entrance = useEntranceOnce(); <div className={cn(entrance && "page-fade-in")}>.
export function useEntranceOnce(): boolean {
  const [animate] = useState(() => !entrancePlayed);
  useEffect(() => {
    entrancePlayed = true;
  }, []);
  return animate;
}
