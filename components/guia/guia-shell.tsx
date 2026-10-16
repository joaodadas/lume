// Casca das páginas /guia: SiteNav no topo, sumário lateral sticky em telas
// largas (um <details> nativo no mobile) e a coluna de conteúdo. Arquivo do
// site, fora da registry.
import type * as React from "react";

import { Sumario } from "@/components/guia/sumario";
import { SiteNav } from "@/components/site-nav";

export function GuiaShell({
  ativo,
  children,
}: {
  ativo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <SiteNav />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <aside className="min-w-0">
          <details className="group lg:hidden">
            <summary className="cursor-pointer list-none rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Sumário
            </summary>
            <Sumario ativo={ativo} className="mt-3" />
          </details>
          <Sumario
            ativo={ativo}
            className="hidden lg:sticky lg:top-16 lg:flex lg:max-h-[calc(100svh-5rem)] lg:overflow-y-auto lg:pr-2"
          />
        </aside>
        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
}
