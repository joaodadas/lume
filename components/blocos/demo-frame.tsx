// Moldura da demo do app-shell no site: um cartão de altura fixa com a sombra
// de chrome, que contém a casca inteira. Arquivo do site, não entra na registry.
import type * as React from "react";

import { cn } from "@/registry/base-vega/lib/utils";

// h-[720px]: altura fixa da moldura para o shell ter um viewport próprio dentro
// da página do site (o app real ocupa a janela, h-svh). As três sobrescritas
// abaixo prendem o shell à moldura: o provider troca h-svh por h-full,
// [contain:layout] faz a moldura virar o bloco de contenção da sidebar
// (position: fixed no desktop) e o container da sidebar passa a medir a
// moldura em vez da janela.
export const FRAME =
  "relative h-[720px] overflow-hidden rounded-lg squircle:rounded-3xl corner-squircle bg-sidebar shadow-(--custom-shadow-chrome)";

export function DemoFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        FRAME,
        "[contain:layout] [&_[data-slot=sidebar-container]]:h-full! [&_[data-slot=sidebar-wrapper]]:h-full! [&_[data-slot=sidebar-wrapper]]:min-h-0!",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A mesma moldura vazia, para o fallback do Suspense enquanto a demo (que lê
 * o relógio no range-picker e no bar-chart) renderiza no servidor. */
export function DemoFrameFallback() {
  return <div aria-hidden className={FRAME} />;
}
