// Vitrine /blocos: o app-shell da registry com um dashboard real dentro, e as
// peças avulsas (login-form, border-beam-card, rolling-text, code-block, chips,
// copy-button, notice) abaixo dele. Os dados fake vivem em components/blocos/mock.ts.
import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardDemo } from "@/components/blocos/dashboard-demo";
import { DemoFrameFallback } from "@/components/blocos/demo-frame";
import { PiecesDemo } from "@/components/blocos/pieces-demo";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Blocos",
  description:
    "O app-shell, a tabela de dados, o seletor de período e as demais composições do lume, montados num dashboard de verdade.",
};

export default function BlocosPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteNav />
      <main className="container mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2 pb-8">
          <h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">
            Blocos
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground text-pretty">
            As composições da registry montadas como num app: a casca com
            sidebar, cabeçalho de página com período, faixa de métricas,
            gráficos, tabela com filtros na URL e estados de carregamento e
            vazio. Abaixo do shell, as peças que vivem fora dele.
          </p>
        </div>

        {/* A demo lê o relógio (range-picker e bar-chart), o que o Cache
            Components só aceita dentro de um Suspense: a moldura vazia é
            pré-renderizada e o shell chega no request. */}
        <Suspense fallback={<DemoFrameFallback />}>
          <DashboardDemo />
        </Suspense>

        <section className="mt-12 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-base font-medium">
              Fora do shell
            </h2>
            <p className="text-sm text-muted-foreground text-pretty">
              Peças de tela de auth, onboarding e detalhe, com as props reais de
              cada arquivo em registry/base-vega/components e blocks.
            </p>
          </div>
          <PiecesDemo />
        </section>
      </main>
    </div>
  );
}
