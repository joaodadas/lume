// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/use-copied.ts @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: só o cabeçalho.
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Transient "copied" flag for copy-to-clipboard buttons. Resets after
 * `timeoutMs`; the timer is cleared on unmount and on re-copy, so a stale
 * timeout never fires into an unmounted component.
 */
// 1500 ms no CopyButton; 2000 ms em botões de prompt e no CodeBlock.
export function useCopied(timeoutMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function markCopied() {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), timeoutMs);
  }

  function resetCopied() {
    clearTimeout(timer.current);
    setCopied(false);
  }

  return { copied, markCopied, resetCopied };
}
