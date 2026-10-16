// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, apps/web/src/components/app/animated-api-key.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: renomeado AnimatedApiKey para RollingText({ value, from?, className }), sem nada de API key no nome; `from` opcional com máscara de pontos do mesmo comprimento como padrão; cn de @/registry/base-vega/lib/utils.
"use client";

import "slot-text/style.css";

import { useEffect, useState } from "react";
import { chromatic } from "slot-text";
import { SlotText } from "slot-text/react";

import { cn } from "@/registry/base-vega/lib/utils";

// Texto que "rola" como caça-níquel até o valor final: revela uma chave
// recém-criada, um ID gerado, um token. Serve para revelação única, não para
// número que muda o tempo todo (para isso, number-ticker).

/**
 * Reveals a freshly-created API key with a "slot machine" roll: it mounts
 * showing the name the user gave the key and then rolls, character by
 * character, into the real key value. slot-text only animates on a *text change
 * after mount* — mounting straight onto the value renders it statically — so the
 * name-then-value two-step is what produces the roll.
 *
 * The full key is always exposed via `aria-label` for screen readers, and
 * callers copy from the source string — never from the animated DOM, whose
 * hidden sizers would scramble a manual selection.
 */
export function RollingText({
  value,
  from,
  className,
}: {
  /** The real key value the roll lands on. */
  value: string;
  /** The text the roll starts from — the name the user gave the key.
   * Sem `from`, a rolagem parte de uma máscara de pontos (·) com o mesmo
   * comprimento de `value`, para a largura não pular durante a animação. */
  from?: string;
  className?: string;
}) {
  const start = from ?? value.replace(/\S/g, "·");
  const [text, setText] = useState(start);

  useEffect(() => {
    // Reset to the name, then flip to the real key on the next frame so the
    // change lands as an animated roll rather than a static rebuild.
    setText(start);
    const id = requestAnimationFrame(() => setText(value));
    return () => cancelAnimationFrame(id);
  }, [start, value]);

  return (
    <SlotText
      text={text}
      aria-label={value}
      options={{
        direction: "down",
        stagger: 15,
        duration: 220,
        bounce: 0,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        color: chromatic({ from: 360 }),
        skipUnchanged: false,
      }}
      className={cn("font-mono text-xs text-foreground", className)}
    />
  );
}
