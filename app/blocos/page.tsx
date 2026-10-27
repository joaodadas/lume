// Vitrine /blocos: os formatos do app-shell (Lateral, Trilho, Agente, Barra e
// Mural), cada um com um app de verdade dentro, e as peças avulsas
// (login-form, border-beam-card, rolling-text, code-block, chips, copy-button,
// notice e a página solta) abaixo deles. Os dados fake vivem em
// components/blocos/mock.ts.
import type { Metadata } from "next";
import { Suspense } from "react";

import {
  FormatosVitrine,
  FormatosVitrineFallback,
} from "@/components/blocos/formatos-vitrine";
import { PiecesDemo } from "@/components/blocos/pieces-demo";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Blocos",
  description:
    "Os formatos do app-shell, a tabela de dados, o seletor de período e as demais composições do lume, montados em apps de verdade.",
};

export default function BlocosPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteNav />
      {/* div, não main: a demo na moldura traz o próprio main (o cartão do
          shell), e o documento só pode ter um. */}
      <div className="container mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2 pb-8">
          <h1 className="font-display text-3xl font-[450] tracking-[-0.025em] text-balance">
            Blocos
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground text-pretty">
            O app-shell nos formatos que o lume oferece, cada um com um app
            dentro: navegação em seções, trilho de ícones, a conversa em altura
            total, a barra de zonas e o mural de TV. Abaixo da moldura, o mesmo
            formato no celular. Depois, as peças que vivem fora do shell.
          </p>
        </div>

        {/* A vitrine lê ?formato= (useSearchParams) e as demos leem o relógio
            (range-picker e bar-chart). A rota é pré-renderizada, e o
            useSearchParams faz a árvore até este Suspense renderizar no
            cliente: o HTML estático leva o fallback, com as mesmas alturas, e
            a vitrine entra na hidratação. */}
        <Suspense fallback={<FormatosVitrineFallback />}>
          <FormatosVitrine />
        </Suspense>

        <section className="mt-12 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-base font-medium">
              Fora do shell
            </h2>
            <p className="text-sm text-muted-foreground text-pretty">
              Peças de tela de auth, onboarding e detalhe, com as props reais de
              cada arquivo em registry/base-vega/components e blocks, e a página
              solta para a tela que não navega.
            </p>
          </div>
          <PiecesDemo />
        </section>
      </div>
    </div>
  );
}
